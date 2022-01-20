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
 * External dependencies
 */
import { __, _x } from '@googleforcreators/i18n';
import { PAGE_RATIO } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { TEXT_SET_SIZE } from '../../../../../constants';

export const CATEGORIES = {
  contact: _x('Contact', 'text set category', 'web-stories'),
  editorial: _x('Editorial', 'text set category', 'web-stories'),
  list: _x('List', 'text set category', 'web-stories'),
  cover: _x('Cover', 'text set category', 'web-stories'),
  section_header: _x('Header', 'text set category', 'web-stories'),
  step: _x('Steps', 'text set category', 'web-stories'),
  table: _x('Table', 'text set category', 'web-stories'),
  quote: _x('Quote', 'text set category', 'web-stories'),
};

export const PANE_TEXT = {
  TITLE: __('Text Sets', 'web-stories'),
  SWITCH_LABEL: __('Match fonts from story', 'web-stories'),
};

export const TEXT_SET_PAGE_SIZE = {
  width: TEXT_SET_SIZE,
  height: TEXT_SET_SIZE / PAGE_RATIO,
};

export { TEXT_SET_SIZE };
