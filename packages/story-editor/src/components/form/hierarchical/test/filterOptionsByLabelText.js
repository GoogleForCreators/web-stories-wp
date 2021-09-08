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
import filterOptionsByLabelText from '../filterOptionsByLabelText';

const OPTIONS = [
  {
    id: 1,
    label: 'apple',
    checked: false,
    options: [
      { id: 'fitty', label: 'corgi', checked: true },
      {
        id: 'sixty',
        label: 'morgi',
        checked: true,
        options: [{ id: 'gritty', label: 'borky', checked: true }],
      },
    ],
  },
  { id: 2, label: 'banana', checked: false },
  { id: 3, label: 'cantaloupe', checked: true },
  {
    id: 4,
    label: 'papaya',
    checked: false,
    options: [
      {
        id: '100',
        label: 'trees',
        checked: true,
        options: [
          { id: '1001', label: 'porgi', checked: true },
          { id: '10011', label: 'hal', checked: true },
        ],
      },
    ],
  },
  { id: 5, label: 'zebra fish', checked: true },
];

describe('filterOptionsByLabelText', () => {
  it('should do no filtering with no text', () => {
    expect(filterOptionsByLabelText(OPTIONS, '')).toStrictEqual(OPTIONS);
    expect(filterOptionsByLabelText(OPTIONS)).toStrictEqual(OPTIONS);
  });

  it('should filter a list of options', () => {
    expect(
      filterOptionsByLabelText(OPTIONS, 'this will not match anything')
    ).toStrictEqual([]);
    expect(filterOptionsByLabelText(OPTIONS, 'org')).toStrictEqual([
      {
        checked: false,
        id: 1,
        label: 'apple',
        options: [
          { checked: true, id: 'fitty', label: 'corgi' },
          {
            checked: true,
            id: 'sixty',
            label: 'morgi',
          },
        ],
      },
      {
        checked: false,
        id: 4,
        label: 'papaya',
        options: [
          {
            checked: true,
            id: '100',
            label: 'trees',
            options: [{ checked: true, id: '1001', label: 'porgi' }],
          },
        ],
      },
    ]);
  });
});
