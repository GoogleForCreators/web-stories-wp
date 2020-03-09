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
import { SHARED_DEFAULT_ATTRIBUTES } from '../shared';
export { default as Display } from './display';
export { default as Edit } from './edit';
export { default as Frame } from './frame';
export { default as Output } from './output';
export { default as TextContent } from './textContent';
export { default as LayerContent } from './layer';
export { default as LayerIcon } from './icon';

export const defaultAttributes = {
  ...SHARED_DEFAULT_ATTRIBUTES,
  scale: 100,
  focalX: 50,
  focalY: 50,
};

export const hasEditMode = true;

export const editModeGrayout = true;

export const isMedia = true;

export const isMaskable = true;

export const resizeRules = {
  vertical: true,
  horizontal: true,
  diagonal: true,
};

export const panels = [
  PanelTypes.BACKGROUND,
  PanelTypes.LAYER_STYLE,
  PanelTypes.BACKGROUND_DISPLAY,
  PanelTypes.SCALE,
  PanelTypes.FILL,
  PanelTypes.LINK,
  PanelTypes.MASK,
];
