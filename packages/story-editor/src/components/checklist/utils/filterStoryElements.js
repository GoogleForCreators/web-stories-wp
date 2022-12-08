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
 * @typedef {import('@googleforcreators/elements').Page} Page
 */

/**
 * Filters through story elements with array.filter
 *
 * @param {Array<Page>} pages The story pages to filter
 * @param {Function} filter The page being checked for guidelines
 * @return {Array<any>} An array of elements that contain a pageId property
 */
export function filterStoryElements(pages, filter) {
  return (pages || [])
    .flatMap((page) =>
      (page?.elements || []).map((element) => ({ ...element, pageId: page.id }))
    )
    .filter(filter);
}
