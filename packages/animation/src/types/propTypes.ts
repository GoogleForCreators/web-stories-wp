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
/* eslint-disable no-restricted-imports -- Still used by other packages. */
import * as PropTypes from 'prop-types';
/* eslint-enable no-restricted-imports -- Still used by other packages. */

/**
 * Internal dependencies
 */
import { AnimationType } from './animation';

// This one did once include all the specs for the different possible fields
// in the animation panel, but we don't want to create those anymore.
export const AnimationFormPropTypes = PropTypes.object;

export const GeneralAnimationPropTypes = {
  delay: PropTypes.number,
  direction: PropTypes.oneOf([
    'normal',
    'reverse',
    'alternate',
    'alternate-reverse',
  ]),
  duration: PropTypes.number,
  easing: PropTypes.string,
  easingPreset: PropTypes.string,
  endDelay: PropTypes.number,
  fill: PropTypes.oneOf(['backwards', 'forwards', 'both', 'none']),
  iterationStart: PropTypes.number,
  iterations: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['infinity', '']),
  ]),
};

export const AnimationProps = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf([...Object.values(AnimationType)]),
  targets: PropTypes.arrayOf(PropTypes.string),
  ...GeneralAnimationPropTypes,
};
