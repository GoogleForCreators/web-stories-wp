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
 * The flags that can be enabled on the editor for feature development
 * and testing.
 *
 * @enum {string}
 */
const Flags = {
  // Flag for using incremental search in media and media3p with a debouncer.
  INCREMENTAL_SEARCH_DEBOUNCE_MEDIA: 'incrementalSearchDebounceMedia',
};

export default Flags;
