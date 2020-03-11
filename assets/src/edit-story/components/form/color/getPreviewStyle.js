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
import generatePatternStyles from '../../../utils/generatePatternStyles';
import createSolid from '../../../utils/createSolid';

export const transparentStyle = {
  backgroundImage:
    'conic-gradient(#fff 0.25turn, #d3d4d4 0turn 0.5turn, #fff 0turn .75turn, #d3d4d4 0turn 1turn)',
  backgroundSize: '66.67% 66.67%',
};

function getPreviewStyle(pattern) {
  if (!pattern) {
    return transparentStyle;
  }
  const isSolidPattern = pattern.type === 'solid' || !pattern.type;
  if (!isSolidPattern) {
    // Should filter out alpha component
    const opaquePattern = { ...pattern, alpha: undefined };
    return generatePatternStyles(opaquePattern);
  }
  const {
    color: { r, g, b, a },
  } = pattern;
  // If opacity is 0, create as transparent:
  if (a === 0) {
    return transparentStyle;
  }

  // Otherwise create color, but with full opacity
  return generatePatternStyles(createSolid(r, g, b));
}

export default getPreviewStyle;
