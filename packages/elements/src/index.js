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

export * from './constants';
export * from './types';
export * from './utils/elementBorder';
export * from './utils/styles';

export { default as elementTypes, registerElementType } from './elementTypes';
export { default as PanelTypes } from './panelTypes';
export { default as canElementHaveBorder } from './utils/canElementHaveBorder';
export { default as createNewElement } from './utils/createNewElement';
export { default as createPage } from './utils/createPage';
export { default as duplicatePage } from './utils/duplicatePage';
export { default as getDefinitionForType } from './utils/getDefinitionForType';
export { default as getElementMask } from './utils/getElementMask';
export { default as getTransformFlip } from './utils/getTransformFlip';
export { default as useColorTransformHandler } from './utils/useColorTransformHandler';
export { default as useCSSVarColorTransformHandler } from './utils/useCSSVarColorTransformHandler';
export {
  calculateFitTextFontSize,
  calculateTextHeight,
} from './utils/textMeasurements';
export { default as calcFontMetrics } from './utils/calcFontMetrics';
export { default as generateParagraphTextStyle } from './utils/generateParagraphTextStyle';
export { default as getHighlightLineHeight } from './utils/getHighlightLineHeight';
export { default as TextOutputWithUnits } from './utils/TextOutputWithUnits';
