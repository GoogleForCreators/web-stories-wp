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
 * Base64-encodes a string with Unicode support.
 *
 * Prefixes the encoded result so it can be easily identified
 * and treated accordingly.
 *
 * @param {string} string string to encode.
 * @return {string} Encoded string.
 */
function base64Encode(string) {
  return '__WEB_STORIES_ENCODED__' + btoa(encodeURIComponent(string));
}

export default base64Encode;
