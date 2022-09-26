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
import { filterOptionsByLabelText, makeFlatOptionTree } from '../utils';

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

describe('makeFlatOptionTree', () => {
  it('appends $level prop if tree is flat', () => {
    const flatOptionTree = makeFlatOptionTree([
      {
        id: 'something',
        label: 'something',
        parent: 0,
      },
      {
        id: 'something-else',
        label: 'something-else',
        parent: 0,
      },
    ]);

    expect(flatOptionTree).toStrictEqual([
      {
        id: 'something',
        label: 'something',
        parent: 0,
        $level: 0,
      },
      {
        id: 'something-else',
        label: 'something-else',
        parent: 0,
        $level: 0,
      },
    ]);
  });

  it('adds proper $level to children options', () => {
    const flatOptionTree = makeFlatOptionTree([
      {
        id: 'a',
        label: 'a',
        parent: 0,
      },
      {
        id: 'b',
        label: 'b',
        parent: 0,
      },
      {
        id: 'aa',
        label: 'aa',
        parent: 'a',
      },
      {
        id: 'bb',
        label: 'bb',
        parent: 'b',
      },
      {
        id: 'ab',
        label: 'ab',
        parent: 'a',
      },
      {
        id: 'bbb',
        label: 'bbb',
        parent: 'bb',
      },
    ]);

    expect(flatOptionTree).toStrictEqual([
      {
        id: 'a',
        label: 'a',
        parent: 0,
        $level: 0,
      },
      {
        id: 'aa',
        label: 'aa',
        parent: 'a',
        $level: 1,
      },
      {
        id: 'ab',
        label: 'ab',
        parent: 'a',
        $level: 1,
      },
      {
        id: 'b',
        label: 'b',
        parent: 0,
        $level: 0,
      },
      {
        id: 'bb',
        label: 'bb',
        parent: 'b',
        $level: 1,
      },
      {
        id: 'bbb',
        label: 'bbb',
        parent: 'bb',
        $level: 2,
      },
    ]);
  });

  it('orders children beneath root entries', () => {
    const findOpt = (id) => (opt) => opt.id === id;

    const flatOptionTree = makeFlatOptionTree([
      {
        id: 'a',
        label: 'a',
        parent: 0,
      },
      {
        id: 'b',
        label: 'b',
        parent: 0,
      },
      {
        id: 'aa',
        label: 'aa',
        parent: 'a',
      },
      {
        id: 'bb',
        label: 'bb',
        parent: 'b',
      },
      {
        id: 'ab',
        label: 'ab',
        parent: 'a',
      },
      {
        id: 'bbb',
        label: 'bbb',
        parent: 'bb',
      },
    ]);

    const getIndex = (id) => flatOptionTree.findIndex(findOpt(id));
    const isInOrder = (...args) =>
      args.every(
        //eslint-disable-next-line jest/no-conditional-in-test
        (el, i, _args) => i === 0 || getIndex(_args[i - 1]) < getIndex(el)
      );

    // sibling order doesn't matter, so that's why we dont
    // test aa vs ab
    expect(isInOrder('a', 'aa', 'b', 'bb', 'bbb')).toBeTrue();
    expect(isInOrder('a', 'ab', 'b', 'bb', 'bbb')).toBeTrue();
  });
});
