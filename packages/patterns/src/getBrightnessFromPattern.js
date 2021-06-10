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
import { getLuminance, rgba } from 'polished';

/**
 * Gets the average brightness of the color/stop colors from a given pattern
 *
 * @param {Object} pattern Patterns as describe by the Pattern type
 * @return {number} A brightness between 0 and 1
 */
function getBrightnessFromPattern(pattern = null) {
  if (pattern === null) {
    return getLuminance(`rgba(0, 0, 0, 0)`);
  }

  const { type = 'solid' } = pattern;
  if (!['solid', 'radial', 'linear'].includes(type)) {
    throw new Error(`Unknown pattern type: '${type}'`);
  }

  if (type === 'solid') {
    const {
      color: { r, g, b, a = 1 },
    } = pattern;
    return getLuminance(`rgba(${r}, ${g}, ${b}, ${a})`);
  }

  const { stops, alpha = 1 } = pattern;
  const getColor = ({ r, g, b, a = 1 }) => rgba(r, g, b, a * alpha);
  const stopLuminances = stops.map(({ color }) =>
    getLuminance(getColor(color))
  );
  return stopLuminances.reduce((a, b) => a + b) / stopLuminances.length;
}

export default getBrightnessFromPattern;
