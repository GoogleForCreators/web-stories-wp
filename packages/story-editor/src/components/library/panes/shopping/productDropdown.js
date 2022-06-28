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
import { ELEMENT_TYPES } from '@googleforcreators/elements';
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
  const { isSaving, currentPageProductIds } = useStory(
    ({
      state: {
        meta: { isSaving },
        currentPage,
      },
    }) => ({
      isSaving,
      currentPageProductIds: currentPage?.elements
        ?.filter(({ type }) => type === ELEMENT_TYPES.PRODUCT)
        .filter(({ product: p }) => p.productId !== product.productId)
        .map(({ product: p }) => p?.productId),
    })
  );

  const onChange = ({ product: newProduct }) => setProduct(newProduct);

  const getProductsByQuery = useCallback(
    async (value = '') => {
      const { products } = await getProducts(value);
      return products
        .filter(
          (p) =>
            p.productImages.length &&
            !currentPageProductIds.includes(p.productId)
        )
        .map((p) => ({
          name: p.productTitle,
          id: p.productId,
          product: p,
        }));
    },
    [currentPageProductIds, getProducts]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Stop getProductsByQuery from re-render.
  }, [initialProducts]);

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
