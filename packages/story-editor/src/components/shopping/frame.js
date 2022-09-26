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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TOOLTIP_PLACEMENT } from '@googleforcreators/design-system';
import { ELEMENT_TYPES } from '@googleforcreators/elements';
import { useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import Tooltip from '../tooltip';
import { useConfig, useFont } from '../../app';
import PillIcon from './icons/pill.svg';

// See https://github.com/ampproject/amphtml/blob/b2dbb6b805529b7cf699dad3a91f6d7556131543/extensions/amp-story-shopping/0.1/amp-story-shopping-tag.css

const StyledTooltip = styled(Tooltip)`
  align-items: center;
  p {
    display: flex;
    max-width: 100%;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    padding: 0;
  }

  background-color: rgba(125, 125, 125, 0.75);
  border-radius: 18px;
  padding-inline-start: 6px;
  padding-inline-end: 12px;
  cursor: pointer;
  height: 36px;
`;

const PillImage = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 100%;
  flex-shrink: 0;
  flex-shrink: 0;
  margin-inline-end: 4px;
`;

function TooltipTitle({ productTagText }) {
  return (
    <>
      <PillImage>
        <PillIcon width={14} height={14} aria-hidden />
      </PillImage>
      {productTagText}
    </>
  );
}

TooltipTitle.propTypes = {
  productTagText: PropTypes.string.isRequired,
};

function WithProductPill({ element, active, children, anchorRef }) {
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  const {
    locale: { locale },
  } = useConfig();

  const elementType = element.type;
  useEffect(() => {
    if (elementType !== ELEMENT_TYPES.PRODUCT) {
      return;
    }

    maybeEnqueueFontStyle([
      {
        font: {
          family: 'Poppins',
          service: 'fonts.google.com',
          weights: [700],
          styles: ['regular'],
          variants: [[0, 700]],
        },
        fontWeight: 700,
      },
    ]);
  }, [elementType, maybeEnqueueFontStyle]);

  if (elementType !== ELEMENT_TYPES.PRODUCT) {
    return children;
  }

  const { productPrice, productPriceCurrency, productTitle } = element.product;

  const productTagText =
    productPrice && productPriceCurrency && locale
      ? new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: productPriceCurrency,
        }).format(productPrice)
      : productTitle;

  return (
    <StyledTooltip
      forceAnchorRef={anchorRef}
      placement={TOOLTIP_PLACEMENT.RIGHT}
      hasTail={false}
      title={active ? <TooltipTitle productTagText={productTagText} /> : null}
    >
      {children}
    </StyledTooltip>
  );
}

WithProductPill.propTypes = {
  element: StoryPropTypes.element.isRequired,
  anchorRef: PropTypes.object,
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default WithProductPill;
