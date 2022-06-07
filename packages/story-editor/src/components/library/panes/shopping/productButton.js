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
import styled from 'styled-components';
import {
  Icons,
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';
import { __, sprintf } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import Tooltip from '../../../tooltip';

const Checkmark = styled(Icons.Checkmark)`
  width: 16px !important;
  height: 16px !important;
  border-radius: 100%;
  color: ${({ theme }) => theme.colors.interactiveBg.disable};
  background-color: ${({ theme }) => theme.colors.fg.positive};
`;

const Cross = styled(Icons.Cross)`
  width: 16px !important;
  height: 16px !important;
  border-radius: 100%;
  color: ${({ theme }) => theme.colors.interactiveBg.disable};
  background-color: ${({ theme }) => theme.colors.fg.negative};
`;

const StyledButton = styled(Button)`
  ${Cross} {
    display: none;
  }

  &:hover ${Checkmark}, &:focus-within ${Checkmark}, &:active ${Checkmark} {
    display: none;
  }

  &:hover ${Cross}, &:focus-within ${Cross}, &:active ${Cross} {
    display: block;
  }
`;

const StyledActionsContainer = styled.div`
  margin-right: 10px;
`;

const DISABLED_PRODUCT_TEXT = __(
  'Products without images cannot be added.',
  'web-stories'
);

const TooltipWrapper = ({ hasImage, children }) => {
  return !hasImage ? (
    <Tooltip hasTail title={DISABLED_PRODUCT_TEXT}>
      {children}
    </Tooltip>
  ) : (
    children
  );
};

TooltipWrapper.propTypes = {
  hasImage: PropTypes.bool,
  children: PropTypes.node,
};

function ProductButton({ product, onClick, onFocus, isOnPage }) {
  const ADD_PRODUCT_TEXT = sprintf(
    /* translators: %s: product title. */
    __('Add %s', 'web-stories'),
    product?.productTitle
  );

  const hasImage = Boolean(product?.productImages?.length);
  const REMOVE_PRODUCT_TEXT = sprintf(
    /* translators: %s: product title. */
    __('Remove %s', 'web-stories'),
    product?.productTitle
  );

  let ariaLabel = '';
  if (!hasImage) {
    ariaLabel = DISABLED_PRODUCT_TEXT;
  } else if (isOnPage) {
    ariaLabel = REMOVE_PRODUCT_TEXT;
  } else {
    ariaLabel = ADD_PRODUCT_TEXT;
  }

  const noop = () => {};

  return (
    <TooltipWrapper hasImage={hasImage}>
      <StyledActionsContainer>
        <StyledButton
          aria-label={ariaLabel}
          aria-disabled={!hasImage}
          // Note for below:
          // In order to support focus for accessibility
          // we have to utilize `noop` for the onClick
          // as `disabled` will disable the ability to focus
          // and tab order does not accomplish the same
          onClick={
            hasImage
              ? () => {
                  onClick(product, isOnPage);
                }
              : noop
          }
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
          onFocus={onFocus}
        >
          {isOnPage ? (
            <>
              <Checkmark />
              <Cross />
            </>
          ) : (
            <Icons.PlusFilled />
          )}
        </StyledButton>
      </StyledActionsContainer>
    </TooltipWrapper>
  );
}

ProductButton.propTypes = {
  product: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  isOnPage: PropTypes.bool,
};

export default ProductButton;
