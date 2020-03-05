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
 * Internal dependencies
 */
import { PanelTypes } from '../../components/panels';
export { default as Display } from './display';
export { default as Edit } from './edit';
export { default as Frame } from './frame';
export { default as Output } from './output';
export { default as TextContent } from './textContent';
export { default as LayerContent } from './layer';
export { default as LayerIcon } from './icon';
export { default as updateForResizeEvent } from './updateForResizeEvent';

export const defaultAttributes = {
  fontFamily: 'Arial',
  fontFallback: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
  fontWeight: 400,
  fontSize: 36,
  fontStyle: 'normal',
  color: '#000000',
  letterSpacing: 'normal',
  lineHeight: 1.3,
  textAlign: 'initial',
};

export const hasEditMode = true;

export const isMedia = false;

export const resizeRules = {
  vertical: false,
  horizontal: true,
  diagonal: true,
};

export const panels = [
  PanelTypes.SIZE_POSITION,
  PanelTypes.TEXT_STYLE,
  PanelTypes.LINK,
];
