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
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import ProductImage from './productImage';
import ProductButton from './productButton';
import ProductPrice from './productPrice';

const StyledDescription = styled.div`
  padding-left: 12px;
`;

const StyledTitle = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.primary};
`;
function Product({ product, onClick, onFocus, isOnPage, canAddMore }) {
  return (
    <>
      <ProductButton
        product={product}
        isOnPage={isOnPage}
        canAddMore={canAddMore}
        onClick={onClick}
        onFocus={onFocus}
      />
      <ProductImage
        product={product}
        isOnPage={isOnPage}
        canAddMore={canAddMore}
      />
      <StyledDescription>
        <StyledTitle isBold>{product?.productTitle}</StyledTitle>
        <ProductPrice
          price={product?.productPrice}
          currency={product?.productPriceCurrency}
        />
      </StyledDescription>
    </>
  );
}

Product.propTypes = {
  product: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  isOnPage: PropTypes.bool,
  canAddMore: PropTypes.bool,
};

export default Product;
