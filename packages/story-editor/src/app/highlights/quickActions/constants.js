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

export const ACTION_TEXT = {
  ADD_ANIMATION: __('Add animation', 'web-stories'),
  ADD_LINK: __('Add link', 'web-stories'),
  ADD_CAPTIONS: __('Add captions', 'web-stories'),
  CHANGE_BACKGROUND_COLOR: __('Change background color', 'web-stories'),
  CHANGE_TEXT_COLOR: __('Change color', 'web-stories'),
  CHANGE_COLOR: __('Change color', 'web-stories'),
  RESET_ELEMENT: __('Reset element', 'web-stories'),
  CHANGE_FONT: __('Edit text', 'web-stories'),
  INSERT_BACKGROUND_MEDIA: __('Insert background media', 'web-stories'),
  INSERT_TEXT: __('Insert text', 'web-stories'),
  REPLACE_BACKGROUND_MEDIA: __('Replace background', 'web-stories'),
  REPLACE_MEDIA: __('Replace media', 'web-stories'),
};

export const RESET_PROPERTIES = {
  ANIMATION: 'animation',
  OVERLAY: 'overlay',
  STYLES: 'styles',
};

export const RESET_DEFAULTS = {
  TEXT_BORDER_RADIUS: {
    locked: true,
    topLeft: 2,
    topRight: 2,
    bottomLeft: 2,
    bottomRight: 2,
  },
  STANDARD_BORDER_RADIUS: 0,
};
