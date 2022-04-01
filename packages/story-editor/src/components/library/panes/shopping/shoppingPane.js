/*
 * Copyright 2020 Google LLC
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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  Datalist,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory, useAPI } from '../../../../app';
import { Row } from '../../../form';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import paneId from './paneId';

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ShoppingPane(props) {
  const isEnabled = useFeature('shoppingIntegration');
  const {
    actions: { getProducts },
  } = useAPI();
  const isSaving = useStory(
    ({
      state: {
        meta: { isSaving },
      },
    }) => isSaving
  );

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialOptions, setInitialOptions] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const products = await getProducts();
      setInitialOptions(
        products.map((p) => ({
          name: p.productTitle,
          id: p.productId,
          product: p,
        }))
      );
      setIsLoading(false);
    })();
  }, [getProducts]);

  const onChange = ({ product: newProduct }) => {
    setProduct(newProduct);
  };

  const getProductsByQuery = useCallback(
    async (value) => {
      const products = await getProducts(value);
      return products.map((p) => ({
        name: p.productTitle,
        id: p.productId,
        product: p,
      }));
    },
    [getProducts]
  );

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const insertProduct = useCallback(() => {
    insertElement('product', {
      width: 25,
      height: 25,
      product,
    });
    setProduct(null);
  }, [insertElement, product]);

  if (!isEnabled) {
    return null;
  }

  const dropDownParams = {
    hasSearch: true,
    lightMode: true,
    onChange,
    getOptionsByQuery: getProductsByQuery,
    selectedId: product?.productId,
    dropDownLabel: __('Product', 'web-stories'),
    placeholder: isLoading ? __('Loading…', 'web-stories') : '',
    disabled: isLoading ? true : isSaving,
    primaryOptions: isLoading ? [] : initialOptions,
    zIndex: 10,
  };

  return (
    <Pane id={paneId} {...props}>
      <Row>
        <HelperText>
          {__(
            'Select a product to add to the page. It will be displayed as a "dot" on the page, as well as in the page attachment.',
            'web-stories'
          )}
        </HelperText>
      </Row>
      <Row>
        <Datalist.DropDown
          options={initialOptions}
          searchResultsLabel={__('Search results', 'web-stories')}
          aria-label={__('Product', 'web-stories')}
          {...dropDownParams}
        />
      </Row>
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        onClick={insertProduct}
        disabled={!product}
      >
        {__('Insert product', 'web-stories')}
      </Button>
    </Pane>
  );
}

export default ShoppingPane;
