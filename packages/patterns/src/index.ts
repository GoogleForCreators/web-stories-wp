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

export * from './types';

export { default as convertToCSS } from './convertToCSS';
export { default as createSolid } from './createSolid';
export { default as createSolidFromString } from './createSolidFromString';
export { default as generatePatternStyles } from './generatePatternStyles';
export { default as getHexFromSolid } from './getHexFromSolid';
export { default as getHexFromSolidArray } from './getHexFromSolidArray';
export { default as getHexFromValue } from './getHexFromValue';
export { default as getOpaquePattern } from './getOpaquePattern';
export { default as getPreviewText } from './getPreviewText';
export { default as getSolidFromHex } from './getSolidFromHex';
export { default as hasGradient } from './hasGradient';
export { default as hasOpacity } from './hasOpacity';
export { default as isPatternEqual } from './isPatternEqual';
export { default as isHexColorString } from './isHexColorString';
