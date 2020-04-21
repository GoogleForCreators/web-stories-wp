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
 * Infer element type from mime type of its resource
 *
 * @param {string} mimeType Mime type.
 * @return {string|null} Element type.
 */
const getTypeFromMime = (mimeType) => {
  if (mimeType.match('image.*')) {
    return 'image';
  } else if (mimeType.match('video.*')) {
    return 'video';
  }
  return null;
};

export default getTypeFromMime;
