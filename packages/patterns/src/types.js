/*
 * Copyright 2021 Google LLC
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

export const HexPropType = PropTypes.shape({
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
  a: PropTypes.number,
});

export const ColorStopPropType = PropTypes.shape({
  color: HexPropType.isRequired,
  position: PropTypes.number.isRequired,
});

export const PatternPropType = PropTypes.shape({
  type: PropTypes.oneOf(['solid', 'linear', 'radial']),
  color: HexPropType,
  stops: PropTypes.arrayOf(ColorStopPropType),
  rotation: PropTypes.number,
  alpha: PropTypes.number,
  center: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  size: PropTypes.shape({
    w: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
});
