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
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { FIELD_TYPES } from '../../constants';
import { AnimationInputPropTypes } from '../types';

export const PulseEffectInputPropTypes = {
  scale: PropTypes.shape(AnimationInputPropTypes),
  iterations: PropTypes.shape(AnimationInputPropTypes),
};

export default {
  scale: {
    label: __('Scale', 'web-stories'),
    tooltip: 'Valid values are greater than or equal to 0',
    type: FIELD_TYPES.FLOAT,
    defaultValue: 0.5,
  },
  iterations: {
    label: _x('Pulses', 'number of pulses', 'web-stories'),
    type: FIELD_TYPES.NUMBER,
    defaultValue: 1,
  },
  duration: {
    label: __('Duration', 'web-stories'),
    type: FIELD_TYPES.NUMBER,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 1450,
  },
};
