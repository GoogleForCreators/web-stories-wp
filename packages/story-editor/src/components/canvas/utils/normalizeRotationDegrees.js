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
 * Converts degrees above 360 or below 0 to an equivalent between 0 and 360.
 * Note that using just degrees % 360 would leave in negative degrees.
 *
 * @param {number} degrees Initial rotation angle.
 * @return {number} Degrees between 0 and 360.
 */
function normalizeRotationDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

export default normalizeRotationDegrees;
