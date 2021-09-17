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
import { filterOptionsByLabelText, getOptionCount } from '../utils';

const OPTIONS = [
  {
    id: 1,
    label: 'apple',
    checked: false,
    options: [
      { id: 'fitty', label: 'corgi', checked: true, options: [] },
      {
        id: 'sixty',
        label: 'morgi',
        checked: true,
        options: [{ id: 'gritty', label: 'borky', checked: true, options: [] }],
      },
    ],
  },
  { id: 2, label: 'banana', checked: false, options: [] },
  { id: 3, label: 'cantaloupe', checked: true, options: [] },
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
          { id: '1001', label: 'porgi', checked: true, options: [] },
          { id: '10011', label: 'hal', checked: true, options: [] },
        ],
      },
    ],
  },
  { id: 5, label: 'zebra fish', checked: true, options: [] },
];

describe('filterOptionsByLabelText', () => {
  it('should do no filtering with no text', () => {
    expect(filterOptionsByLabelText(OPTIONS, '')).toStrictEqual(OPTIONS);
    expect(filterOptionsByLabelText(OPTIONS, '     ')).toStrictEqual(OPTIONS);
    expect(filterOptionsByLabelText(OPTIONS)).toStrictEqual(OPTIONS);
  });

  it('should filter a list of options', () => {
    expect(
      filterOptionsByLabelText(OPTIONS, 'this will not match anything')
    ).toStrictEqual([]);
    expect(filterOptionsByLabelText(OPTIONS, '   apple    ')).toStrictEqual([
      {
        checked: false,
        id: 1,
        label: 'apple',
        options: [],
      },
    ]);
    expect(filterOptionsByLabelText(OPTIONS, 'org')).toStrictEqual([
      {
        checked: false,
        id: 1,
        label: 'apple',
        options: [
          { checked: true, id: 'fitty', label: 'corgi', options: [] },
          {
            checked: true,
            id: 'sixty',
            label: 'morgi',
            options: [],
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
            options: [
              { checked: true, id: '1001', label: 'porgi', options: [] },
            ],
          },
        ],
      },
    ]);
  });
});

describe('getOptionCount', () => {
  it.each`
    options      | result
    ${[]}        | ${0}
    ${undefined} | ${0}
    ${[{}]}      | ${1}
    ${OPTIONS}   | ${11}
  `('should count the number of nested options', ({ options, result }) => {
    expect(getOptionCount(options)).toStrictEqual(result);
  });
});
