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
 * External dependencies
 */
import { uniqueEntriesByKey } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { TEMPLATE_META_DATA_TYPES } from '../constants';

/**
 * Takes an dictionary of templates and extracts their metadata
 * to return an array of meta data entries compatible with the
 * dashboard header search options
 *
 * @param {Object} templates templates dictionary keyed by id
 * @return {Array<Object>} array of entries
 */
function getTemplateFilters(templates) {
  const templatesArr = Object.values(templates);

  const colors = templatesArr
    .flatMap((t) => t.colors)
    .map((c) => ({
      label: c.family,
      value: c.family,
      type: TEMPLATE_META_DATA_TYPES.COLOR,
    }));

  const tags = templatesArr
    .flatMap((t) => t.tags)
    .map((tag) => ({
      label: tag,
      value: tag,
      type: TEMPLATE_META_DATA_TYPES.TAG,
    }));

  const verticals = templatesArr
    .map((t) => t.vertical)
    .map((vertical) => ({
      label: vertical,
      value: vertical,
      type: TEMPLATE_META_DATA_TYPES.VERTICAL,
    }));

  const title = templatesArr.map((t) => ({
    label: t.title,
    value: t.title,
    type: TEMPLATE_META_DATA_TYPES.TITLE,
  }));

  return [
    ...uniqueEntriesByKey(tags, 'label'),
    ...uniqueEntriesByKey(colors, 'label'),
    ...uniqueEntriesByKey(verticals, 'label'),
    ...uniqueEntriesByKey(title, 'label'),
  ];
}

export default getTemplateFilters;
