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
} from '@googleforcreators/patterns';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';

const SIZE = 24;

const Transparent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 100%;
  ${themeHelpers.transparentBg}
`;

const SwatchButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border-color: transparent;
  padding: 0;
  border-width: 0;
  display: block;
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 100%;
  overflow: hidden;
  position: relative;
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
      cursor: default;
      /* pointer-events none here fixes an edge case in Safari when swatch is within a tooltip #9188 */
      pointer-events: none;
    `}
  ${({ theme }) => themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

  ::after {
    content: '';
    position: absolute;
    /* pointer-events none here fixes an edge case in Safari when swatch is within a tooltip #9188 */
    pointer-events: none;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.divider.primary};
  }
`;

const SwatchPreview = styled(SwatchButton).attrs({ as: 'div', type: '' })``;

const SwatchItem = styled.div`
  transform: rotate(${({ displaySplit }) => (displaySplit ? -45 : 0)}deg);
  display: block;
  width: 100%;
  height: 100%;
  font-size: 13px;
  position: relative;

  svg {
    width: ${SIZE}px;
    height: ${SIZE}px;
    position: absolute;
    top: calc(50% - ${SIZE / 2}px);
    left: calc(50% - ${SIZE / 2}px);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
    color: ${({ theme }) => theme.colors.fg.primary};
    transform: rotate(${({ displaySplit }) => (displaySplit ? 45 : 0)}deg);
  }
`;

const OpaqueColorWrapper = styled.div`
  height: ${SIZE}px;
  width: 50%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
`;

const OpaqueColor = styled.div`
  height: ${SIZE}px;
  width: ${SIZE}px;
  position: absolute;
  top: 0;
  left: 0;
  ${({ pattern }) => generatePatternStyles(pattern)}
`;

function Swatch({
  pattern,
  children,
  isPreview = false,
  isDisabled = false,
  isIndeterminate = false,
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
  // gradient swatches and indeterminates are never split
  const displaySplit =
    !swatchIsGradient && swatchHasTransparency && !isIndeterminate;
  const SwatchDisplay = isPreview ? SwatchPreview : SwatchButton;
  return (
    <SwatchDisplay disabled={isDisabled} className={className} {...props}>
      {swatchHasTransparency && <Transparent />}
      <SwatchItem
        style={generatePatternStyles(pattern)}
        displaySplit={displaySplit}
      >
        {displaySplit && (
          <OpaqueColorWrapper>
            <OpaqueColor style={generatePatternStyles(opaquePattern)} />
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
  isPreview: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isIndeterminate: PropTypes.bool,
  className: PropTypes.string,
};

export { Swatch };
