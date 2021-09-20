/*
 * Copyright 2021 Google LLC
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
import {
  generatePatternStyles,
  getOpaquePattern,
  hasGradient,
  hasOpacity,
  PatternPropType,
} from '@web-stories-wp/patterns';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';

const RADIUS_LARGE = 32;
const RADIUS_SMALL = 24;
const ICON_SIZE = 32;

const Transparent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 100%;
  ${themeHelpers.transparentBg}
`;

const SwatchButton = styled.button.attrs({ type: 'button' })`
  cursor: pointer;
  background-color: transparent;
  border-color: transparent;
  padding: 0;
  border-width: 0;
  display: block;
  width: ${({ isSmall }) => (isSmall ? RADIUS_SMALL : RADIUS_LARGE)}px;
  height: ${({ isSmall }) => (isSmall ? RADIUS_SMALL : RADIUS_LARGE)}px;
  border-radius: 100%;
  overflow: hidden;
  position: relative;
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
      cursor: default;
    `}
  ${({ theme }) => themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

  ::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.divider.primary};
  }
`;

const SwatchPreview = styled(SwatchButton).attrs({ as: 'div', type: '' })``;

const presetCSS = css`
  display: block;
  width: 100%;
  height: 100%;
  font-size: 13px;
  position: relative;

  svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    position: absolute;
    top: calc(50% - ${ICON_SIZE / 2}px);
    left: calc(50% - ${ICON_SIZE / 2}px);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
  }
`;
const SwatchItem = styled.div`
  ${presetCSS}
  ${({ $pattern }) => generatePatternStyles($pattern)}
  transform: rotate(${({ displaySplit }) => (displaySplit ? -45 : 0)}deg);

  svg {
    color: ${({ theme }) => theme.colors.fg.primary};
    transform: rotate(${({ displaySplit }) => (displaySplit ? 45 : 0)}deg);
  }
`;

const OpaqueColorWrapper = styled.div`
  height: ${({ isSmall }) => (isSmall ? RADIUS_SMALL : RADIUS_LARGE)}px;
  width: 50%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
`;

const OpaqueColor = styled.div`
  height: ${({ isSmall }) => (isSmall ? RADIUS_SMALL : RADIUS_LARGE)}px;
  width: ${({ isSmall }) => (isSmall ? RADIUS_SMALL : RADIUS_LARGE)}px;
  position: absolute;
  top: 0;
  left: 0;
  ${({ pattern }) => generatePatternStyles(pattern)}
`;

function Swatch({
  pattern,
  isDisabled = false,
  isSmall = false,
  children,
  isPreview,
  className = '',
  ...props
}) {
  if (!pattern) {
    return null;
  }
  const swatchHasTransparency = hasOpacity(pattern);
  const swatchIsGradient = hasGradient(pattern);
  const opaquePattern = swatchHasTransparency
    ? getOpaquePattern(pattern)
    : pattern;
  // Small swatches and gradient swatches are never split.
  const displaySplit = !isSmall && !swatchIsGradient && swatchHasTransparency;
  const SwatchDisplay = isPreview ? SwatchPreview : SwatchButton;
  return (
    <SwatchDisplay
      disabled={isDisabled}
      isSmall={isSmall}
      className={className}
      {...props}
    >
      {swatchHasTransparency && <Transparent />}
      <SwatchItem
        $pattern={pattern}
        disabled={isDisabled}
        displaySplit={displaySplit}
      >
        {displaySplit && (
          <OpaqueColorWrapper isSmall={isSmall}>
            <OpaqueColor isSmall={isSmall} pattern={opaquePattern} />
          </OpaqueColorWrapper>
        )}
        {children}
      </SwatchItem>
    </SwatchDisplay>
  );
}

Swatch.propTypes = {
  children: PropTypes.node,
  pattern: PatternPropType,
  isDisabled: PropTypes.bool,
  isSmall: PropTypes.bool,
  isPreview: PropTypes.bool,
  className: PropTypes.string,
};

export { Swatch };
