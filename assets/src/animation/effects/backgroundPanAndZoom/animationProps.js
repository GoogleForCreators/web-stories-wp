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
import { __, sprintf } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { FIELD_TYPES, SCALE_DIRECTION } from '../../constants';
import { AnimationInputPropTypes } from '../types';

export const ZoomEffectInputPropTypes = {
  zoomFrom: PropTypes.shape(AnimationInputPropTypes),
};

export default {
  zoomDirection: {
    label: __('Direction', 'web-stories'),
    tooltip: sprintf(
      /* translators: 1: scaleIn. 2: scaleOut */
      __('Valid values are %1$s or %2$s', 'web-stories'),
      'zoomIn',
      'zoomOut'
    ),
    type: FIELD_TYPES.DIRECTION_PICKER,
    values: [SCALE_DIRECTION.SCALE_IN, SCALE_DIRECTION.SCALE_OUT],
    defaultValue: SCALE_DIRECTION.SCALE_OUT,
  },
};
