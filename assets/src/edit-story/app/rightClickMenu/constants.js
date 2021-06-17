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
import { _x, __ } from '@web-stories-wp/i18n';

export const RIGHT_CLICK_MENU_LABELS = {
  COPY: __('Copy', 'web-stories'),
  PASTE: __('Paste', 'web-stories'),
  DELETE: __('Delete', 'web-stories'),
  DUPLICATE_PAGE: __('Duplicate page', 'web-stories'),
  DELETE_PAGE: __('Delete page', 'web-stories'),
};

export const RIGHT_CLICK_MENU_SHORTCUT_LABELS = {
  COMMAND_C: _x(
    'Command C',
    'The keyboard keys "Command" and "C"',
    'web-stories'
  ),
  CONTROL_C: _x(
    'Control C',
    'The keyboard keys "Control" and "C"',
    'web-stories'
  ),
  COMMAND_V: _x(
    'Command V',
    'The keyboard keys "Command" and "V"',
    'web-stories'
  ),
  CONTROL_V: _x(
    'Control V',
    'The keyboard keys "Control" and "V"',
    'web-stories'
  ),
  DELETE: _x('Delete', 'The keyboard key "Delete"', 'web-stories'),
};
