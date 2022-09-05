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
import { parseToRgb } from 'polished';

/**
 * Internal dependencies
 */
import createSolid from './createSolid';

function createSolidFromString(str: string) {
  const rgb = parseToRgb(str);
  const { red, green, blue } = rgb;
  const alpha = 'alpha' in rgb ? rgb.alpha : undefined;
  return createSolid(red, green, blue, alpha);
}

export default createSolidFromString;
