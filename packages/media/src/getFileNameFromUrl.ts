/*
 * Copyright 2021 Google LLC
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
 * Returns the file name including extension from a URL.
 *
 * @param url File URL.
 * @return File name.
 */
function getFileNameFromUrl(url: string): string {
  const tail = url.split('/').at(-1);
  if (!tail) {
    // Edge case that doesn't happen for a proper URL.
    return url;
  }

  return tail.split(/[#?]/).at(0) ?? tail;
}

export default getFileNameFromUrl;
