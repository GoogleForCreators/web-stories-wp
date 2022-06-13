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
  useSnackbar,
  InfiniteScroller,
  LoadingSpinner,
} from '@googleforcreators/design-system';
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { Section } from '../../common';
import { useAPI, useConfig } from '../../../../app';
import { Row } from '../../../form';
import { Pane } from '../shared';
import { useStory } from '../../../../app/story';
import useLibrary from '../../useLibrary';
import paneId from './paneId';
import ProductList from './productList';
import ProductSort from './productSort';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ShoppingPane(props) {
  const { showSnackbar } = useSnackbar();
  const { shoppingProvider } = useConfig();
  const isShoppingIntegrationEnabled = useFeature('shoppingIntegration');
  const speak = useLiveRegion('assertive');
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderby, setOrderby] = useState('date');
  const [order, setOrder] = useState('desc');
  const [isMenuFocused, setIsMenuFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const {
    actions: { getProducts },
  } = useAPI();

  const { currentPageProducts, deleteElementById } = useStory(
    ({ actions, state: { currentPage } }) => ({
      currentPageProducts: currentPage?.elements
        ?.filter(({ type }) => type === ELEMENT_TYPES.PRODUCT)
        .map(({ id, product }) => ({
          elementId: id,
          product,
        })),
      deleteElementById: actions.deleteElementById,
    })
  );

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const getProductsByQuery = useCallback(
    async (value = '', _page = 1, sortBy, sortOrder) => {
      try {
        setIsLoading(true);
        const { products: _products, hasNextPage } = await getProducts(
          value,
          _page,
          sortBy,
          sortOrder
        );
        if (_page === 1) {
          setProducts(_products);
        } else {
          setProducts([...products, ..._products]);
        }
        setCanLoadMore(hasNextPage);
      } catch (err) {
        showSnackbar({ message: err.message });
        setProducts([]);
        setCanLoadMore(false);
        setPage(1);
      } finally {
        setIsLoading(false);
        setLoaded(true);
      }
    },
    [getProducts, products, showSnackbar]
  );

  const debouncedProductsQuery = useDebouncedCallback(getProductsByQuery, 300);

  const isShoppingEnabled =
    'none' !== shoppingProvider && isShoppingIntegrationEnabled;

  useEffect(() => {
    if (isShoppingEnabled) {
      debouncedProductsQuery(searchTerm, page, orderby, order);
    }
  }, [
    debouncedProductsQuery,
    isShoppingEnabled,
    searchTerm,
    orderby,
    order,
    page,
  ]);

  useEffect(() => {
    if (!isShoppingEnabled) {
      setProducts(currentPageProducts?.map(({ product }) => product));
      setIsLoading(false);
      setLoaded(true);
    }
  }, [currentPageProducts, isShoppingEnabled]);

  const handleFocus = () => setIsMenuFocused(false);

  const onSortBy = (option) => {
    setOrderby(option.orderby);
    setOrder(option.order);
    setPage(1);
  };

  const handleInputKeyPress = useCallback((event) => {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'Tab') {
      setIsMenuFocused(true);
    }
  }, []);

  const onSearch = useCallback(
    (evt) => {
      const value = evt.target.value;
      if (value !== searchTerm) {
        setSearchTerm(value);
        setPage(1);
      }
    },
    [searchTerm, setSearchTerm]
  );

  const insertProduct = useCallback(
    (product) => {
      insertElement(ELEMENT_TYPES.PRODUCT, {
        width: 25,
        height: 25,
        product,
      });

      const PRODUCT_ADDED_TEXT = sprintf(
        /* translators: %s: product title. */
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
        (item) => item.product.productId === product.productId
      );
      if (element) {
        deleteElementById({ elementId: element.elementId });

        const PRODUCT_REMOVED_TEXT = sprintf(
          /* translators: %s: product title. */
          __('%s removed', 'web-stories'),
          product?.productTitle
        );

        speak(PRODUCT_REMOVED_TEXT);
      }
    },
    [deleteElementById, currentPageProducts, speak]
  );

  const onClick = useCallback(
    (product, onPage) =>
      onPage ? deleteProduct(product) : insertProduct(product),
    [deleteProduct, insertProduct]
  );

  const handleClearInput = useCallback(() => {
    setSearchTerm('');
    setPage(1);
  }, [setSearchTerm]);

  const onLoadMore = useCallback(() => {
    if (canLoadMore) {
      setPage(page + 1);
    }
  }, [canLoadMore, page]);

  const allDataLoadedMessage =
    page > 1 ? __('No more products', 'web-stories') : '';

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
        {isShoppingEnabled && (
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
            <ProductSort onChange={onSortBy} sortId={`${orderby}-${order}`} />
          </Row>
        )}
        {!loaded && isLoading && (
          <LoadingContainer>
            <LoadingSpinner animationSize={50} circleSize={6} />
          </LoadingContainer>
        )}
        {products?.length > 0 && (
          <>
            <ProductList
              isMenuFocused={isMenuFocused}
              onClick={onClick}
              products={products}
              onPageProducts={currentPageProducts}
            />
            <InfiniteScroller
              allDataLoadedMessage={allDataLoadedMessage}
              allDataLoadedAriaMessage={__(
                'Products are loaded',
                'web-stories'
              )}
              onLoadMore={onLoadMore}
              canLoadMore={canLoadMore}
              isLoading={isLoading}
              loadingAriaMessage={__('Loading more products', 'web-stories')}
            />
          </>
        )}
        {loaded && !isLoading && products?.length === 0 && (
          <HelperText>{__('No products found.', 'web-stories')}</HelperText>
        )}
      </Section>
    </Pane>
  );
}

export default ShoppingPane;
