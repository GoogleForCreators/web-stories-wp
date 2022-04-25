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
 * Internal dependencies
 */
import { TEMPLATE_META_DATA_TYPES } from '../constants';

/**
 * Takes an array of template meta data filter entries
 * and composes them into a function that takes a template
 * and returns true if the template satisfies any of the
 * meta data filters.
 *
 * @param {Array} filters filter entries to compose
 * @return {Function} function that takes a template and returns true or false
 */
function composeTemplateFilter(filters) {
  return (template) => {
    return (
      !filters ||
      filters.some((filter) => {
        switch (filter?.type) {
          case TEMPLATE_META_DATA_TYPES.TAG:
            return template.tags
              .map((tag) => tag.toLowerCase())
              .includes(filter.value.toLowerCase());

          case TEMPLATE_META_DATA_TYPES.COLOR:
            return template.colors
              .map((color) => color.label.toLowerCase())
              .includes(filter.value.toLowerCase());

          case TEMPLATE_META_DATA_TYPES.VERTICAL:
            return template.vertical
              .toLowerCase()
              .includes(filter.value.toLowerCase());
          case TEMPLATE_META_DATA_TYPES.TITLE:
            return template.title
              .toLowerCase()
              .includes(filter.value.toLowerCase());

          default:
            return true;
        }
      })
    );
  };
}

export default composeTemplateFilter;
