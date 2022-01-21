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
import PropTypes from 'prop-types';
import { __, _x } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import {
  ANIMATION_TYPES,
  ANIMATION_EFFECTS,
  FIELD_TYPES,
  BEZIER,
} from '../constants';
import { AnimationInputPropTypes } from '../effects/types';

export const BasicAnimationInputPropTypes = {
  duration: PropTypes.shape(AnimationInputPropTypes),
  delay: PropTypes.shape(AnimationInputPropTypes),
};

export const basicAnimationProps = {
  duration: {
    label: __('Duration', 'web-stories'),
    type: FIELD_TYPES.NUMBER,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 1000,
  },
  delay: {
    label: __('Delay', 'web-stories'),
    type: FIELD_TYPES.NUMBER,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 0,
  },
};

export default {
  id: {
    type: FIELD_TYPES.HIDDEN,
  },
  type: {
    label: __('Animation Type', 'web-stories'),
    type: FIELD_TYPES.DROPDOWN,
    values: [
      ...Object.values(ANIMATION_TYPES),
      ...Object.values(ANIMATION_EFFECTS).map((o) => o.value),
    ],
  },
  ...basicAnimationProps,
  direction: {
    type: FIELD_TYPES.DROPDOWN,
    values: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    defaultValue: 'normal',
  },
  easingPreset: {
    label: __('Easing Presets', 'web-stories'),
    type: FIELD_TYPES.DROPDOWN,
    values: ['Use Default', ...Object.keys(BEZIER)],
    defaultValue: Object.keys(BEZIER)[0],
  },
  easing: {
    type: FIELD_TYPES.TEXT,
  },
  fill: {
    type: FIELD_TYPES.DROPDOWN,
    values: ['backwards', 'forwards', 'both', 'none'],
    defaultValue: 'forwards',
  },
  iterations: {
    tooltip: __(
      'Valid values are numerical or the word "infinity"',
      'web-stories'
    ),
    type: FIELD_TYPES.TEXT,
  },
};
