/*
 * Copyright 2023 Google LLC
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
import { getSettings } from './settings';

function hasLeadingZeros() {
  const settings = getSettings();
  const { timeFormat } = settings;

  if (!timeFormat) {
    return true;
  }
debugger;
  return /h(?!\\)/.test(
    timeFormat
      .toLowerCase() // Test only for the lower case "h".
      .replace(/\\\\/g, '') // Replace "//" with empty strings.
      .split('')
      .reverse()
      .join('') // Reverse the string and test for "h" not followed by a slash.
  );
}

export default hasLeadingZeros;
