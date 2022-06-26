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
import { useEffect } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { MAX_PRODUCTS_PER_PAGE } from '../../../../constants';
import useProductNavigation from './useProductNavigation';
import Product from './product';

const StyledListItem = styled.div`
  display: flex;
  width: 100%;
  padding: 5px 0;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.tertiary};
  transition: background-color ease-in-out 300ms;
`;

function ProductList({
  products = [],
  onPageProducts = [],
  onClick,
  isMenuFocused = true,
}) {
  const { handleListNav, currentRowsRef, setCurrentFocusIndex } =
    useProductNavigation({ isMenuFocused, products });

  useEffect(() => {
    if (!isMenuFocused) {
      setCurrentFocusIndex(0);
    }
  }, [isMenuFocused, setCurrentFocusIndex]);

  const onFocus = (evt, index) => {
    if (currentRowsRef.current[`row-${index}`] && evt.type === 'focus') {
      setCurrentFocusIndex(index);
    }
  };

  const canAddMore = onPageProducts.length < MAX_PRODUCTS_PER_PAGE;
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- list handles arrow up and arrow down
    <div
      aria-label={__('Products list', 'web-stories')}
      role="list"
      onKeyDown={handleListNav}
    >
      {products.map((product, index) => {
        return (
          <StyledListItem
            role="listitem"
            key={product?.productId}
            tabIndex={-1}
            ref={
              (el) => (currentRowsRef.current[`row-${index}`] = el) // track the active row
            }
          >
            <Product
              product={product}
              canAddMore={canAddMore}
              isOnPage={onPageProducts.some(
                (item) => item.product.productId === product?.productId
              )}
              onClick={onClick}
              onFocus={(evt) => {
                onFocus(evt, index);
              }}
            />
          </StyledListItem>
        );
      })}
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  onPageProducts: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func.isRequired,
  isMenuFocused: PropTypes.bool,
};

export default ProductList;
