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
import { __ } from '@googleforcreators/i18n';
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from '@googleforcreators/react';
import { Datalist } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory, useAPI } from '../../../../app';

function ProductDropdown({ product, setProduct, ...rest }) {
  const initialProducts = useMemo(
    () => [{ id: product?.productId, name: product?.productTitle, product }],
    [product]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [initialOptions, setInitialOptions] = useState(initialProducts);

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
      const { products } = await getProducts(value);
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
        setInitialOptions(initialProducts);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [getProductsByQuery, initialProducts]);

  const dropDownParams = {
    hasSearch: true,
    lightMode: true,
    onChange,
    getOptionsByQuery: getProductsByQuery,
    selectedId: product?.productId,
    dropDownLabel: __('Product', 'web-stories'),
    disabled: isSaving,
    primaryOptions: isLoading ? initialProducts : initialOptions,
    zIndex: 10,
  };

  return (
    <Datalist.DropDown
      options={initialOptions}
      searchResultsLabel={__('Search results', 'web-stories')}
      aria-label={__('Product', 'web-stories')}
      {...dropDownParams}
      {...rest}
    />
  );
}

ProductDropdown.propTypes = {
  product: PropTypes.object,
  setProduct: PropTypes.func,
};

export default ProductDropdown;
