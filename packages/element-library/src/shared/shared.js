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
import { css } from 'styled-components';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { getBorderStyle, getBorderRadius } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import { generateFontFamily } from '../text/util';

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

// TODO: removed round/ceil, calculateFitTextFontSize needs to be improved?
export const elementWithSize = css`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;

export const elementWithRotation = css`
  transform: ${({ rotationAngle }) => `rotate(${rotationAngle}deg)`};
`;

export const elementWithBorderRadius = css`
  ${(props) => getBorderRadius(props)}
`;

export const elementWithHighlightBorderRadius = ({
  borderRadius,
  dataToEditorY,
}) =>
  dataToEditorY &&
  css`
    border-radius: ${dataToEditorY(borderRadius?.topLeft || 0)}px
      ${dataToEditorY(borderRadius?.topRight || 0)}px
      ${dataToEditorY(borderRadius?.bottomRight || 0)}px
      ${dataToEditorY(borderRadius?.bottomLeft || 0)}px;
  `;

export const elementWithBorder = css`
  ${({ border, borderRadius, width, height, mask }) =>
    getBorderStyle({
      border,
      borderRadius,
      width,
      height,
      mask,
    })}
  background-clip: padding-box;
`;

export const elementWithBackgroundColor = css`
  ${({ backgroundColor }) =>
    backgroundColor && generatePatternStyles(backgroundColor)};
`;

export const elementWithFont = css`
  white-space: pre-line;
  font-family: ${({ font }) => generateFontFamily(font)};
  overflow-wrap: break-word;
  word-break: break-word;
  letter-spacing: normal;
  font-style: ${({ fontStyle }) => fontStyle};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  color: #000000;
`;

// See generateParagraphTextStyle for the full set of properties.
export const elementWithTextParagraphStyle = css`
  margin: ${({ margin }) => margin};
  padding: ${({ padding }) => padding || 0};
  line-height: ${({ lineHeight }) => lineHeight};
  text-align: ${({ textAlign }) => textAlign};
  overflow-wrap: break-word;
`;

export const elementWithFlip = css`
  transform: ${({ transformFlip }) => transformFlip};
`;
