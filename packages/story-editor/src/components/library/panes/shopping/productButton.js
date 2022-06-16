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
import { __, _n, sprintf } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import Tooltip from '../../../tooltip';
import { noop } from '../../../../utils/noop';
import { MAX_PRODUCTS_PER_PAGE } from '../../../../constants';

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

const DISABLED_PRODUCT_TEXT = sprintf(
  /* translators: %s: max number of products. */
  _n(
    'Only %d item can be added per page.',
    'Only %d items can be added per page.',
    MAX_PRODUCTS_PER_PAGE,
    'web-stories'
  ),
  MAX_PRODUCTS_PER_PAGE
);

const DISABLED_PRODUCT_IMAGE_TEXT = __(
  'Products without images cannot be added.',
  'web-stories'
);

const TooltipWrapper = ({ hasImage, disabled, children }) => {
  if (!hasImage) {
    return (
      <Tooltip hasTail title={DISABLED_PRODUCT_IMAGE_TEXT}>
        {children}
      </Tooltip>
    );
  } else if (disabled) {
    return (
      <Tooltip hasTail title={DISABLED_PRODUCT_TEXT}>
        {children}
      </Tooltip>
    );
  } else {
    return children;
  }
};

TooltipWrapper.propTypes = {
  disabled: PropTypes.bool,
  hasImage: PropTypes.bool,
  children: PropTypes.node,
};

function ProductButton({ product, onClick, onFocus, isOnPage, canAddMore }) {
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

  const disabled = !isOnPage && !canAddMore;

  let ariaLabel = '';
  if (!hasImage) {
    ariaLabel = DISABLED_PRODUCT_IMAGE_TEXT;
  } else if (isOnPage) {
    ariaLabel = REMOVE_PRODUCT_TEXT;
  } else if (disabled) {
    ariaLabel = DISABLED_PRODUCT_TEXT;
  } else {
    ariaLabel = ADD_PRODUCT_TEXT;
  }

  return (
    <TooltipWrapper hasImage={hasImage} disabled={disabled}>
      <StyledActionsContainer>
        <StyledButton
          aria-label={ariaLabel}
          aria-disabled={!hasImage || disabled}
          // Note for below:
          // In order to support focus for accessibility
          // we have to utilize `noop` for the onClick
          // as `disabled` will disable the ability to focus
          // and tab order does not accomplish the same
          onClick={
            hasImage && !disabled
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
  canAddMore: PropTypes.bool,
};

export default ProductButton;
