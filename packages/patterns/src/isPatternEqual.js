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
import convertToCSS from './convertToCSS';
import generatePatternStyles from './generatePatternStyles';

export default function isPatternEqual(p1, p2, patternType = undefined) {
  const p1CSS = convertToCSS(generatePatternStyles(p1, patternType));
  const p2CSS = convertToCSS(generatePatternStyles(p2, patternType));
  return p1CSS === p2CSS;
}
