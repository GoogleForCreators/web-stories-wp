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
import {
  ANIMATION_TYPES,
  ANIMATION_EFFECTS,
  FIELD_TYPES,
  BEZIER,
} from '../constants';

export default {
  id: {
    type: FIELD_TYPES.HIDDEN,
  },
  type: {
    label: 'Animation Type',
    type: FIELD_TYPES.DROPDOWN,
    values: [
      ...Object.values(ANIMATION_TYPES),
      ...Object.values(ANIMATION_EFFECTS),
    ],
  },
  duration: {
    label: 'Duration (ms)',
    type: FIELD_TYPES.NUMBER,
    defaultValue: 1000,
  },
  delay: {
    label: 'Delay (ms)',
    type: FIELD_TYPES.NUMBER,
    defaultValue: 0,
  },
  direction: {
    type: FIELD_TYPES.DROPDOWN,
    values: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    defaultValue: 'normal',
  },
  easingPreset: {
    label: 'Easing Presets',
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
    tooltip: 'Valid values are numerical or the word "infinity"',
    type: FIELD_TYPES.TEXT,
  },
};
