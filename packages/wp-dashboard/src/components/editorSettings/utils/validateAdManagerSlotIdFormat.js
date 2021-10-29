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

// Example: /123456789/a4a/amp_story_dfp_example
// Ad unit codes  (the "amp_story_dfp_example" part) can be up to 100 characters in length.
// Only letters, numbers, underscores, hyphens, periods, asterisks, forward slashes, backslashes, exclamations, left angle brackets, colons and parentheses are allowed.
const adManagerSlotIdFormatRegex =
  /^\/\d+(,\d+)?(\/[\w\-.*/\\![:()]{1,99}[^/])*$/;

export default function validateAdManagerSlotIdFormat(value = '') {
  return Boolean(value.toLowerCase().match(adManagerSlotIdFormatRegex));
}
