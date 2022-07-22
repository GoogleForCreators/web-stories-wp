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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import LibraryMoveable from '../shared/libraryMoveable';
import { PRODUCT_WIDTH, PRODUCT_HEIGHT } from './constants';

const imgPlaceholder = css`
  display: block;
  margin-right: 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.disable};
  width: 41px;
  height: 41px;
`;

const StyledImgPlaceHolder = styled.div`
  ${imgPlaceholder}
`;

const ProductImageWrap = styled.div`
  position: relative;
`;

const StyledImage = styled.img`
  ${imgPlaceholder}
  object-fit: cover;
`;

const StyledImageClone = styled.img`
  opacity: 0;
  position: absolute;
  object-fit: cover;
  border-radius: 4px;
  width: ${PRODUCT_WIDTH}px;
  height: ${PRODUCT_HEIGHT}px;
`;

function ProductImage({ product }) {
  const imageSrc = product?.productImages[0]?.url || '';
  return imageSrc ? (
    <StyledImage
      alt={product?.productImages[0]?.alt}
      src={imageSrc}
      loading="lazy"
      decoding="async"
      draggable={false}
      crossOrigin="anonymous"
    />
  ) : (
    <StyledImgPlaceHolder />
  );
}

ProductImage.propTypes = {
  product: PropTypes.object.isRequired,
};

function DraggableProductImage({ product, draggable }) {
  const src = product?.productImages[0]?.url || '';
  return (
    <ProductImageWrap>
      <ProductImage product={product} />
      {draggable && src && (
        <LibraryMoveable
          type="product"
          elementProps={{ product }}
          cloneElement={StyledImageClone}
          cloneProps={{
            loading: 'lazy',
            decoding: 'async',
            crossOrigin: 'anonymous',
            src,
          }}
        />
      )}
    </ProductImageWrap>
  );
}

DraggableProductImage.propTypes = {
  product: PropTypes.object.isRequired,
  draggable: PropTypes.bool,
};

export default DraggableProductImage;
