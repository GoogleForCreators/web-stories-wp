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

export const NONE = 'NONE';
export const ITALIC = 'CUSTOM-ITALIC';
export const UNDERLINE = 'CUSTOM-UNDERLINE';
export const WEIGHT = 'CUSTOM-WEIGHT';
export const COLOR = 'CUSTOM-COLOR';
export const LETTERSPACING = 'CUSTOM-LETTERSPACING';

export const NORMAL_WEIGHT = 400;
export const SMALLEST_BOLD = 600;
export const DEFAULT_BOLD = 700;

export const isStyle = (style, prefix) =>
  typeof style === 'string' && style.startsWith(prefix);
export const getVariable = (style, prefix) => style.slice(prefix.length + 1);

export const weightToStyle = (weight) => `${WEIGHT}-${weight}`;
export const styleToWeight = (style) =>
  isStyle(style, WEIGHT) ? parseInt(getVariable(style, WEIGHT)) : null;

export const letterSpacingToStyle = (ls) =>
  `${LETTERSPACING}-${ls < 0 ? 'N' : ''}${Math.abs(ls)}`;
export const styleToLetterSpacing = (style) => {
  if (!isStyle(style, LETTERSPACING)) {
    return null;
  }
  const raw = getVariable(style, LETTERSPACING);
  // Negative numbers are prefixed with an N:
  if (raw.charAt(0) === 'N') {
    return -parseInt(raw.slice(1));
  }
  return parseInt(raw);
};

export const styleToColor = (style) =>
  isStyle(style, COLOR) ? getVariable(style, COLOR) : null;
export const colorToStyle = (color) => `${COLOR}-${color}`;
