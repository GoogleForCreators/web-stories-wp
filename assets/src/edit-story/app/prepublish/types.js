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
 * Guidance return object
 *
 * @typedef {Guidance} Guidance
 * @property {string} type The type/severity of the message [error, warning, guidance]
 * @property {string} [pageId] The ID of the page being checked
 * @property {string} [elementId] The ID of the element being checked
 * @property {string} [storyId] The ID of the story element being checked
 *
 */
