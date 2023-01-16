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
import { __ } from '@googleforcreators/i18n';

export const ACTIONS = {
  ADD_ANIMATION: {
    trackingEventName: 'add_animation',
    text: __('Add animation', 'web-stories'),
  },
  ADD_LINK: {
    trackingEventName: 'add_link',
    text: __('Add link', 'web-stories'),
  },
  ADD_CAPTIONS: {
    trackingEventName: 'add_captions',
    text: __('Add captions', 'web-stories'),
  },
  AUTO_STYLE_TEXT: {
    trackingEventName: 'auto_style_text',
    text: __('Adaptive text colors', 'web-stories'),
  },
  CHANGE_BACKGROUND_COLOR: {
    trackingEventName: 'change_background_color',
    text: __('Change background color', 'web-stories'),
  },
  CHANGE_TEXT_COLOR: {
    trackingEventName: 'change_text_color',
    text: __('Change color', 'web-stories'),
  },
  CHANGE_COLOR: {
    trackingEventName: 'change_color',
    text: __('Change color', 'web-stories'),
  },
  RESET_ELEMENT: {
    trackingEventName: 'reset_element',
    text: __('Reset element', 'web-stories'),
  },
  CHANGE_FONT: {
    trackingEventName: 'change_font',
    text: __('Edit text', 'web-stories'),
  },
  INSERT_BACKGROUND_MEDIA: {
    trackingEventName: 'insert_background_media',
    text: __('Insert background media', 'web-stories'),
  },
  INSERT_TEXT: {
    trackingEventName: 'insert_text',
    text: __('Insert text', 'web-stories'),
  },
  REPLACE_BACKGROUND_MEDIA: {
    trackingEventName: 'replace_background_media',
    text: __('Replace background', 'web-stories'),
  },
  REPLACE_MEDIA: {
    trackingEventName: 'replace_media',
    text: __('Replace media', 'web-stories'),
  },
  TRIM_VIDEO: {
    trackingEventName: 'trim_video',
    text: __('Trim video', 'web-stories'),
  },
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
