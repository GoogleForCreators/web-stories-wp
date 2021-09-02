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
 * Creates an object of templates grouped by tag
 *
 * @param {Array.<Object>} templates An array of templates.
 * @return {Object} An object of templates grouped by tag name
 */
export const groupTemplatesByTag = (templates) =>
  templates.reduce((result, template) => {
    template.tags.forEach((tag) => {
      if (result[tag]) {
        result[tag].push(template);
      } else {
        result[tag] = [template];
      }
    });

    return result;
  }, {});
