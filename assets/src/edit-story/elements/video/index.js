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
export { default as LayerContent } from './layer';
export { default as LayerIcon } from './icon';

export const defaultAttributes = {
  controls: false,
  loop: false,
  autoPlay: true,
  posterId: null,
  poster: null,
  videoId: 0,
  opacity: 100,
};

export const hasEditMode = true;

export const isMedia = true;

export const resizeRules = {
  vertical: true,
  horizontal: true,
  diagonal: true,
};

export const panels = [
  PanelTypes.BACKGROUND,
  PanelTypes.BACKGROUND_STYLE,
  PanelTypes.BACKGROUND_DISPLAY,
  PanelTypes.MEDIA_STYLE,
  PanelTypes.SIZE,
  PanelTypes.POSITION,
  PanelTypes.SCALE,
  PanelTypes.ROTATION_ANGLE,
  PanelTypes.VIDEO_POSTER,
  PanelTypes.FILL,
  PanelTypes.MASK,
];
