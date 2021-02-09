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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { FIELD_TYPES, DIRECTION } from '../../constants';
import { AnimationInputPropTypes } from '../types';

export const RotateInEffectInputPropTypes = {
  rotateInDir: PropTypes.shape(AnimationInputPropTypes),
};

export default {
  rotateInDir: {
    label: __('Direction', 'web-stories'),
    type: FIELD_TYPES.DIRECTION_PICKER,
    values: [DIRECTION.LEFT_TO_RIGHT, DIRECTION.RIGHT_TO_LEFT],
    defaultValue: DIRECTION.LEFT_TO_RIGHT,
  },
};
