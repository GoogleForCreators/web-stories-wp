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
import {
  createSolid,
  generatePatternStyles,
} from '@googleforcreators/patterns';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE } from '../../../constants';

function getPreviewStyle(pattern) {
  if (!pattern || pattern === MULTIPLE_VALUE) {
    return {};
  }
  const isSolidPattern = pattern.type === 'solid' || !pattern.type;
  if (!isSolidPattern) {
    // Should filter out alpha component
    const opaquePattern = { ...pattern, alpha: undefined };
    return generatePatternStyles(opaquePattern);
  }
  const {
    color: { r, g, b },
  } = pattern;
  return generatePatternStyles(createSolid(r, g, b));
}

export default getPreviewStyle;
