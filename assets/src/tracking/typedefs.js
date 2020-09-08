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
 * @typedef EventData
 * @property {string} send_to Tracking ID
 * @property {string} event_category The event category (e.g. 'editor'). GA defaults this to 'engagement'.
 * @property {string} event_label The event label (e.g. 'search_term').
 * @property {string} event_value The event value (e.g. the actual search term).
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
