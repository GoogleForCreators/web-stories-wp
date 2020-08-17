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

export const KeyframesPropTypes = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
  PropTypes.string,
]);

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
