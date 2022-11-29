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

/**
 * Internal dependencies
 */
import { BEZIER } from '../constants';
import { FieldType, NonBackgroundAnimationType } from '../types';

export const basicAnimationFields = {
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 1000,
  },
  delay: {
    label: __('Delay', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 0,
  },
};

export const allFields = {
  id: {
    type: FieldType.Hidden,
  },
  type: {
    label: __('Animation Type', 'web-stories'),
    type: FieldType.Dropdown,
    values: [NonBackgroundAnimationType],
  },
  ...basicAnimationFields,
  direction: {
    type: FieldType.Dropdown,
    values: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    defaultValue: 'normal',
  },
  easingPreset: {
    label: __('Easing Presets', 'web-stories'),
    type: FieldType.Dropdown,
    values: ['Use Default', ...Object.keys(BEZIER)],
    defaultValue: Object.keys(BEZIER)[0],
  },
  easing: {
    type: FieldType.Text,
  },
  fill: {
    type: FieldType.Dropdown,
    values: ['backwards', 'forwards', 'both', 'none'],
    defaultValue: 'forwards',
  },
  iterations: {
    tooltip: __(
      'Valid values are numerical or the word "infinity"',
      'web-stories'
    ),
    type: FieldType.Text,
  },
};
