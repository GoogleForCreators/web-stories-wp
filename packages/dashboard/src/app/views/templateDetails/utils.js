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
 * Get templates related to the currently selected template.
 *
 * @param {Object} template The selected template.
 * @param {Object} taggedTemplatesDictionary Object of templates keyed by tag type.
 * @return {Array} Array of templates related to the selected template.
 */
export const getRelatedTemplates = (template, taggedTemplatesDictionary) => {
  if (!taggedTemplatesDictionary || !template.tags) {
    return [];
  }

  const allRelatedTemplates = template.tags.flatMap(
    (tag) => taggedTemplatesDictionary[tag]
  );

  // Remove duplicates
  const uniqueRelatedTemplates = Array.from(new Set(allRelatedTemplates));

  return uniqueRelatedTemplates.filter(({ id }) => id !== template.id);
};
