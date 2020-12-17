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
 * Internal dependencies
 */
import { getOptions, getInset } from '../utils';

const basicDropdownOptions = [
  {
    label: 'label item one',
    value: 'label-item-one',
  },
  {
    label: 'label item two',
    value: 'label-item-two',
  },
  {
    label: 'label item three',
    value: 'label-item-three',
  },
];

describe('Dropdown/utils getOptions', () => {
  it('should shape and sanititize basic dropdown options', () => {
    const groupedOptions = getOptions(basicDropdownOptions);

    expect(groupedOptions).toStrictEqual([
      {
        group: [
          {
            label: 'label item one',
            value: 'label-item-one',
          },
          {
            label: 'label item two',
            value: 'label-item-two',
          },
          {
            label: 'label item three',
            value: 'label-item-three',
          },
        ],
      },
    ]);
  });

  it('should shape and sanititize basic dropdown options even when some data is bad', () => {
    const basicDropdownOptions = [
      {
        label: 'label item one',
        value: 'label-item-one',
      },
      {
        label: 'label item two',
        value: 'label-item-two',
      },
      {
        label: 'label item three',
        value: 'label-item-three',
      },
      'just a string',
      { label: 'bad data sneaking through', somethingNew: [1, 2, 3] },
    ];

    const groupedOptions = getOptions(basicDropdownOptions);

    expect(groupedOptions).toStrictEqual([
      {
        group: [
          {
            label: 'label item one',
            value: 'label-item-one',
          },
          {
            label: 'label item two',
            value: 'label-item-two',
          },
          {
            label: 'label item three',
            value: 'label-item-three',
          },
        ],
      },
    ]);
  });

  it('should shape and sanititize nested dropdown options', () => {
    const nestedDropdownOptions = [
      'something terrible',
      ['lions', 'tigers', 'bears'],
      {
        label: 'aliens',
        options: [
          { value: 'alien-1', label: 'ET' },
          { value: 'alien-2', label: 'Stitch' },
          { value: 'alien-3', label: 'Groot' },
        ],
      },
      {
        label: 'dogs',
        options: [
          { value: 'dog-1', label: 'Snoopy' },
          { value: 'dog-2', label: 'Scooby' },
        ],
      },
      {
        label: 'tricky content',
        options: [
          { value: 0, label: '0 as a number' },
          { value: false, label: 'false as a boolean' },
          { value: true, label: 'true as a boolean' },
          { value: undefined, label: "undefined and shouldn't come through" },
        ],
      },
    ];

    const groupedOptions = getOptions(nestedDropdownOptions);

    expect(groupedOptions).toStrictEqual([
      {
        group: [
          { label: 'ET', value: 'alien-1' },
          { label: 'Stitch', value: 'alien-2' },
          { label: 'Groot', value: 'alien-3' },
        ],
        label: 'aliens',
      },
      {
        group: [
          {
            label: 'Snoopy',
            value: 'dog-1',
          },
          {
            label: 'Scooby',
            value: 'dog-2',
          },
        ],
        label: 'dogs',
      },
      {
        group: [
          {
            label: '0 as a number',
            value: 0,
          },
          {
            label: 'false as a boolean',
            value: false,
          },
          {
            label: 'true as a boolean',
            value: true,
          },
        ],
        label: 'tricky content',
      },
    ]);
  });
});

describe('Dropdown/utils getInset', () => {
  it('should take sanitized dropdown options and structure placement by group', () => {
    const sanitizedOptions = getOptions(basicDropdownOptions);
    const option = getInset(sanitizedOptions, 0, 2);

    expect(option).toBe(2);
  });
});
