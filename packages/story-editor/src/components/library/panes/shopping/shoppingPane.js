/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import { useFeature } from 'flagged';
import styled from 'styled-components';
import {
  useCallback,
  useState,
  useEffect,
  useDebouncedCallback,
} from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  Text,
  THEME_CONSTANTS,
  SearchInput,
  useLiveRegion,
  CircularProgress
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Section } from '../../common';
import { useAPI } from '../../../../app';
import { Row } from '../../../form';
import { Pane } from '../shared';
import { useStory } from '../../../../app/story';
import useLibrary from '../../useLibrary';
import paneId from './paneId';
import ProductList from './productList';

const Loading = styled.div`
  position: relative;
  margin-left: 10px;
  margin-top: 10px;
`;

const Spinner = styled.div`
  position: absolute;
  top: 0;
`;

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ShoppingPane(props) {
  const isShoppingIntegrationEnabled = useFeature('shoppingIntegration');
  const speak = useLiveRegion('assertive');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuFocused, setIsMenuFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const {
    actions: { getProducts },
  } = useAPI();

  const { currentPageProducts } = useStory(({ state: { currentPage } }) => ({
    currentPageProducts: currentPage?.elements
      ?.filter(({ type }) => type === 'product')
      .map(({ id, product }) => ({
        elementId: id,
        productId: product?.productId,
      })),
  }));

  const getProductsByQuery = useCallback(
    async (value = '') => {
      try {
        setIsLoading(true);
        setProducts(await getProducts(value));
      } catch (err) {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [getProducts]
  );

  const onSearch = useCallback(
    (evt) => {
      const value = evt.target.value;
      if (value !== searchTerm) {
        setSearchTerm(value);
      }
    },
    [searchTerm, setSearchTerm]
  );

  const debouncedProductsQuery = useDebouncedCallback(getProductsByQuery, 300);

  useEffect(
    () => debouncedProductsQuery(searchTerm),
    [searchTerm, debouncedProductsQuery]
  );

  const handleInputKeyPress = useCallback((event) => {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'Tab') {
      setIsMenuFocused(true);
    }
  }, []);

  const handleFocus = () => setIsMenuFocused(false);

  const { deleteElementById } = useStory(({ actions }) => ({
    deleteElementById: actions.deleteElementById,
  }));

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const insertProduct = useCallback(
    (product) => {
      insertElement('product', {
        width: 25,
        height: 25,
        product,
      });

      const PRODUCT_ADDED_TEXT = sprintf(
        /* translators: %s: product title added to page.*/
        __('%s added to page', 'web-stories'),
        product.productTitle
      );

      speak(PRODUCT_ADDED_TEXT);
    },
    [insertElement, speak]
  );

  const deleteProduct = useCallback(
    (product) => {
      const element = currentPageProducts.find(
        (item) => item.productId === product.productId
      );
      if (element) {
        deleteElementById({ elementId: element.elementId });
      }
    },
    [deleteElementById, currentPageProducts]
  );

  const onClick = useCallback(
    (product, onPage) =>
      onPage ? deleteProduct(product) : insertProduct(product),
    [deleteProduct, insertProduct]
  );

  const handleClearInput = useCallback(() => {
    setSearchTerm('');
    getProductsByQuery();
  }, [setSearchTerm, getProductsByQuery]);

  if (!isShoppingIntegrationEnabled) {
    return null;
  }

  return (
    <Pane id={paneId} {...props}>
      <Section
        data-testid="products-library-pane"
        title={__('Products', 'web-stories')}
      >
        <Row>
          <HelperText>
            {__(
              'This will add products as a tappable dot on your story.',
              'web-stories'
            )}
          </HelperText>
        </Row>
        <Row>
          <SearchInput
            aria-label={__('Product search', 'web-stories')}
            inputValue={searchTerm}
            onChange={onSearch}
            placeholder={__('Search', 'web-stories')}
            onKeyDown={handleInputKeyPress}
            onFocus={handleFocus}
            isOpen
            ariaClearLabel={__('Clear product search', 'web-stories')}
            clearId="clear-product-search"
            handleClearInput={handleClearInput}
          />
        </Row>
        {isLoading &&
          <Loading>
            <Spinner>
              <CircularProgress size={24} />
            </Spinner>
          </Loading>
        }
        {!isLoading && products?.length > 0 &&
          <ProductList
            isMenuFocused={isMenuFocused}
            onClick={onClick}
            products={products}
            onPageProducts={currentPageProducts}
          />
        }
        {!isLoading && products?.length === 0 & searchTerm?.length ? (
          <HelperText>{__('No products found.', 'web-stories')}</HelperText>
        ) : null}
      </Section>
    </Pane>
  );
}

export default ShoppingPane;
