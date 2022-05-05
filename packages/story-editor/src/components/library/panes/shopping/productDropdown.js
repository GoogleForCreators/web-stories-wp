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

/**
 * External dependencies
 */
import { __ } from '@googleforcreators/i18n';
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { Datalist } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory, useAPI } from '../../../../app';

const StyledDropDown = styled(Datalist.DropDown)`
  width: 240px;
`;
function ProductDropdown({ product, setProduct }) {
  const isShoppingIntegrationEnabled = useFeature('shoppingIntegration');

  const [isLoading, setIsLoading] = useState(false);
  const [initialOptions, setInitialOptions] = useState([]);

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

  const onChange = ({ product: newProduct }) => setProduct(newProduct);

  const getProductsByQuery = useCallback(
    async (value = '') => {
      const products = await getProducts(value);
      return products.map((p) => ({
        name: p.productTitle,
        id: p.productId,
        product: p,
      }));
    },
    [getProducts]
  );

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const products = await getProductsByQuery();
        setInitialOptions(products);
      } catch (err) {
        setInitialOptions([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [getProductsByQuery]);

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

  if (!isShoppingIntegrationEnabled) {
    return null;
  }

  return (
    <StyledDropDown
      options={initialOptions}
      searchResultsLabel={__('Search results', 'web-stories')}
      aria-label={__('Product', 'web-stories')}
      {...dropDownParams}
    />
  );
}

ProductDropdown.propTypes = {
  product: PropTypes.object,
  setProduct: PropTypes.func,
};

export default ProductDropdown;
