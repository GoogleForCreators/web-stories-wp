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

/**
 * Internal dependencies
 */
import { Cross } from '../../icons';
import {
  getOpaqueColor,
  presetHasGradient,
  presetHasOpacity,
} from '../../../edit-story/components/panels/design/preset/utils';
import generatePatternStyles from '../../../edit-story/utils/generatePatternStyles';

const RADIUS_LARGE = 32;
const RADIUS_SMALL = 24;
const REMOVE_ICON_SIZE = 32;

const Transparent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: conic-gradient(
    ${({ theme }) => theme.colors.fg.tertiary} 0.25turn,
    transparent 0turn 0.5turn,
    ${({ theme }) => theme.colors.fg.tertiary} 0turn 0.75turn,
    transparent 0turn 1turn
  );
  background-size: 8px 8px;
  border-radius: 100%;
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
`;

const presetCSS = css`
  display: block;
  width: 100%;
  height: 100%;
  font-size: 13px;
  position: relative;
  svg {
    width: ${REMOVE_ICON_SIZE}px;
    height: ${REMOVE_ICON_SIZE}px;
    position: absolute;
    top: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    left: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
  }
`;
const SwatchItem = styled.div`
  ${presetCSS}
  ${({ pattern }) => generatePatternStyles(pattern)}
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
  isEditable = false,
  isDisabled = false,
  isSmall = false,
  ...props
}) {
  if (!pattern) {
    return null;
  }
  const hasTransparency = presetHasOpacity(pattern);
  const hasGradient = presetHasGradient(pattern);
  const opaquePattern = hasTransparency ? getOpaqueColor(pattern) : pattern;
  // Small swatches and gradient swatches are never split.
  const displaySplit = !isSmall && !hasGradient && hasTransparency;
  return (
    <SwatchButton disabled={isDisabled} isSmall={isSmall} {...props}>
      {hasTransparency && <Transparent />}
      <SwatchItem
        pattern={pattern}
        disabled={isDisabled}
        displaySplit={displaySplit}
      >
        {displaySplit && (
          <OpaqueColorWrapper isSmall={isSmall}>
            <OpaqueColor isSmall={isSmall} pattern={opaquePattern} />
          </OpaqueColorWrapper>
        )}
        {isEditable && <Cross />}
      </SwatchItem>
    </SwatchButton>
  );
}

Swatch.propTypes = {
  pattern: PropTypes.object,
  isEditable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSmall: PropTypes.bool,
};

export { Swatch };
