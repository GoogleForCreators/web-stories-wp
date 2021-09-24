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

/**
 * Internal dependencies
 */
import Slider from './slider';

export const Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  height: 40px;
  gap: 14px;
`;

export const Wrapper = styled.div`
  position: relative;
  flex-basis: ${({ pageWidth }) => pageWidth}px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.standard.white};
  /* Note: background to be updated in 9104 */
  background-color: ${({ theme }) => theme.colors.standard.white};
`;

export const Handle = styled(Slider)`
  top: 6px;
  bottom: 6px;
  width: 6px;
  margin-left: -3px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3),
    0px 1px 3px 1px rgba(60, 64, 67, 0.15);
  cursor: col-resize;

  &:focus {
    border-color: ${({ theme }) => theme.colors.border.focus};
  }

  &.focus-visible {
    outline: none !important;
  }
`;

export const CurrentTime = styled(Slider)`
  top: -3px;
  bottom: -3px;
  width: 6px;
  margin-left: -3px;
  border-radius: 6px;
  border-width: 0;
  background-color: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
  box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3),
    0px 1px 3px 1px rgba(60, 64, 67, 0.15);
`;

const SVG = styled.svg`
  position: absolute;
  top: -1px;
`;

export const ButtonWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 100px;
  display: flex;
  justify-content: ${({ isStart }) => (isStart ? 'flex-end' : 'flex-start')};
`;

export function Scrim({ width, atStart = false }) {
  const floatStyle = atStart ? { left: '-1px' } : { right: '-1px' };
  // These paths appear to be a bit magic, but are exactly what's required to draw the
  // desired shape, which includes negative border radii and thus cannot be done in CSS only
  const path = atStart
    ? `M 4 0 h ${width} a 4 4 0 0 0 -4 4 v 28 a 4 4 0 0 0 4 4 h -${width} a 4 4 0 0 1 -4 -4 v -28 a 4 4 0 0 1 4 -4 Z`
    : `M 0 0 h ${width} a 4 4 0 0 1 4 4 v 28 a 4 4 0 0 1 -4 4 h -${width} a 4 4 0 0 0 4 -4 v -28 a 4 4 0 0 0 -4 -4 Z`;

  return (
    <SVG
      style={{ width: `${width + 4}px`, ...floatStyle }}
      viewBox={`0 0 ${width + 4} 36`}
    >
      <path stroke="transparent" fill="black" fillOpacity="0.5" d={path} />
    </SVG>
  );
}

Scrim.propTypes = {
  width: PropTypes.number.isRequired,
  atStart: PropTypes.bool,
};
