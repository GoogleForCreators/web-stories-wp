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
import { __ } from '@web-stories-wp/i18n';

export const ELEMENT_TYPE = {
  IMAGE: 'image',
  SHAPE: 'shape',
  TEXT: 'text',
  VIDEO: 'video',
  GIF: 'gif',
  BACKGROUND: 'background',
};

export const ELEMENT_TYPE_COPY = {
  [ELEMENT_TYPE.IMAGE]: __('image', 'web-stories'),
  [ELEMENT_TYPE.SHAPE]: __('shape', 'web-stories'),
  [ELEMENT_TYPE.TEXT]: __('text', 'web-stories'),
  [ELEMENT_TYPE.VIDEO]: __('video', 'web-stories'),
  [ELEMENT_TYPE.GIF]: __('gif', 'web-stories'),
  [ELEMENT_TYPE.BACKGROUND]: __('background', 'web-stories'),
};

export const ACTION_TEXT = {
  ADD_ANIMATION: __('Add animation', 'web-stories'),
  ADD_LINK: __('Add link', 'web-stories'),
  CHANGE_BACKGROUND_COLOR: __('Change background color', 'web-stories'),
  CHANGE_COLOR: __('Change color', 'web-stories'),
  CLEAR_ANIMATIONS: __('Clear animations', 'web-stories'),
  CLEAR_ANIMATION_AND_FILTERS: __('Clear filters and animation', 'web-stories'),
  INSERT_BACKGROUND_MEDIA: __('Insert background media', 'web-stories'),
  INSERT_TEXT: __('Insert text', 'web-stories'),
  REPLACE_BACKGROUND_MEDIA: __('Replace background', 'web-stories'),
  REPLACE_MEDIA: __('Replace media', 'web-stories'),
};

export const RESET_PROPERTIES = {
  ANIMATION: 'animation',
  OVERLAY: 'overlay',
};

export const RESET_LIST_COPY = {
  [RESET_PROPERTIES.ANIMATION]: __('animations', 'web-stories'),
  [RESET_PROPERTIES.OVERLAY]: __('filters', 'web-stories'),
};
