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
import composeTemplateFilter from '../composeTemplateFilter';
import { TEMPLATE_META_DATA_TYPES } from '../../constants';

describe('composeTemplateFilter', () => {
  it('filters a template properly given a set of meta data entries', () => {
    const filter = composeTemplateFilter([
      { family: 'red', value: 'red', type: TEMPLATE_META_DATA_TYPES.COLOR },
      { label: 'red', value: 'red', type: TEMPLATE_META_DATA_TYPES.TAG },
      {
        label: 'Travel',
        value: 'Travel',
        type: TEMPLATE_META_DATA_TYPES.VERTICAL,
      },
    ]);

    // tags filter correctly
    expect(
      filter({
        tags: ['red'],
        colors: [{ family: 'green' }],
        vertical: 'Books',
      })
    ).toBeTruthy();

    // colors filter correctly
    expect(
      filter({
        tags: ['blue'],
        colors: [{ family: 'red' }],
        vertical: 'Books',
      })
    ).toBeTruthy();

    // verticals filter correctly
    expect(
      filter({
        tags: ['blue'],
        colors: [{ family: 'blue' }],
        vertical: 'Travel',
      })
    ).toBeTruthy();

    // exclusion filters correctly
    expect(
      filter({
        tags: ['blue'],
        colors: [{ family: 'blue' }],
        vertical: 'Books',
      })
    ).not.toBeTruthy();
  });
});
