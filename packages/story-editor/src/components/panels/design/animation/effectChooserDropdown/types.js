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
import { DIRECTION, SCALE_DIRECTION } from '@googleforcreators/animation';
/**
 * Internal dependencies
 */
import { GRID_SIZING } from './dropdownConstants';

const ANIMATION_OPTION_PROP_TYPE = {
  ariaLabel: PropTypes.string,
  value: PropTypes.string.isRequired,
  Effect: PropTypes.any,
  gridSpace: PropTypes.oneOf(Object.values(GRID_SIZING)),
  size: PropTypes.number,
  scaleDirection: PropTypes.oneOf(Object.values(SCALE_DIRECTION)),
  panDirection: PropTypes.oneOf(Object.values(DIRECTION)),
  zoomDirection: PropTypes.oneOf(Object.values(SCALE_DIRECTION)),
  flyInDirection: PropTypes.oneOf(Object.values(DIRECTION)),
  rotateInDirection: PropTypes.oneOf(Object.values(DIRECTION)),
  whooshInDirection: PropTypes.oneOf(Object.values(DIRECTION)),
};

export const ANIMATION_DROPDOWN_OPTION_PROP_TYPE = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  animation: PropTypes.shape(ANIMATION_OPTION_PROP_TYPE),
};

export const ANIMATION_DIRECTION_PROP_TYPE = PropTypes.oneOf([
  ...Object.values(DIRECTION),
  ...Object.values(SCALE_DIRECTION),
  false,
]);
