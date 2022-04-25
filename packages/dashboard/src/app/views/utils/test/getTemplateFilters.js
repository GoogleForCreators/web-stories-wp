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
import getTemplateFilters from '../getTemplateFilters';
import { TEMPLATE_META_DATA_TYPES } from '../../constants';

describe('getTemplateFilters', () => {
  it('returns unique meta data entries', () => {
    const templates = [
      {
        colors: [
          { family: 'blue', label: 'blue' },
          { family: 'green', label: 'green' },
          { family: 'red', label: 'red' },
        ],
        tags: ['Greece', 'Italy', 'Spain'],
        vertical: 'Travel',
        title: 'Travel The World'
      },
      {
        colors: [{ family: 'red', label: 'red' }],
        tags: ['Reading', 'I might like tv better', 'red'],
        vertical: 'Books',
        title: 'All the books'
      },
    ];
    expect(getTemplateFilters(templates)).toStrictEqual([
      { label: 'Greece', value: 'Greece', type: TEMPLATE_META_DATA_TYPES.TAG },
      { label: 'Italy', value: 'Italy', type: TEMPLATE_META_DATA_TYPES.TAG },
      { label: 'Spain', value: 'Spain', type: TEMPLATE_META_DATA_TYPES.TAG },
      {
        label: 'Reading',
        value: 'Reading',
        type: TEMPLATE_META_DATA_TYPES.TAG,
      },
      {
        label: 'I might like tv better',
        value: 'I might like tv better',
        type: TEMPLATE_META_DATA_TYPES.TAG,
      },
      { label: 'red', value: 'red', type: TEMPLATE_META_DATA_TYPES.TAG },
      { label: 'blue', value: 'blue', type: TEMPLATE_META_DATA_TYPES.COLOR },
      { label: 'green', value: 'green', type: TEMPLATE_META_DATA_TYPES.COLOR },
      { label: 'red', value: 'red', type: TEMPLATE_META_DATA_TYPES.COLOR },
      {
        label: 'Travel',
        value: 'Travel',
        type: TEMPLATE_META_DATA_TYPES.VERTICAL,
      },
      {
        label: 'Books',
        value: 'Books',
        type: TEMPLATE_META_DATA_TYPES.VERTICAL,
      },
      {
        label: 'Travel The World',
        value: 'Travel The World',
        type: TEMPLATE_META_DATA_TYPES.TITLE
      },
      {
        label: 'All the books',
        value: 'All the books',
        type: TEMPLATE_META_DATA_TYPES.TITLE
      },
    ]);
  });
});
