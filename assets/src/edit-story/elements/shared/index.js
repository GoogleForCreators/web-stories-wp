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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import generatePatternCSS from '../../utils/generatePatternCSS';
import convertToCSS from '../../utils/convertToCSS';
export { default as getMediaProps } from './getMediaProps';
export { default as getFocalFromOffset } from './getFocalFromOffset';
export { default as EditPanMovable } from './editPanMovable';
export { default as ScalePanel } from './scalePanel';

export const CropBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.mg.v1}70;
    pointer-events: none;
  }
`;

export const elementFillContent = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const elementWithPosition = css`
  position: absolute;
  z-index: 1;
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
`;

export const elementWithSize = css`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;

export const elementWithRotation = css`
  transform: ${({ rotationAngle }) => `rotate(${rotationAngle}deg)`};
`;

export const elementWithBackgroundColor = css`
  ${({ backgroundColor }) => convertToCSS(generatePatternCSS(backgroundColor))};
`;

export const elementWithFontColor = css`
  ${({ color }) => convertToCSS(generatePatternCSS(color, 'color'))};
`;

export const elementWithFont = css`
  white-space: pre-wrap;
  font-family: ${({ fontFamily }) => fontFamily};
  font-style: ${({ fontStyle }) => fontStyle};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
`;

export const elementWithStyle = css`
  padding: ${({ padding }) => (padding ? padding : '0')}%;
  line-height: ${({ lineHeight }) => lineHeight};
  letter-spacing: ${({ letterSpacing }) =>
    letterSpacing ? letterSpacing + 'em' : null};
  text-align: ${({ textAlign }) => textAlign};
`;
