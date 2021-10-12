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
import { makeFlatOptionTree } from '../utils';

describe('makeFlatOptionTree', () => {
  it('appends $level prop if tree is flat', () => {
    const flatOptionTree = makeFlatOptionTree([
      {
        id: 'something',
        parent: 0,
      },
      {
        id: 'something-else',
        parent: 0,
      },
    ]);

    expect(flatOptionTree).toStrictEqual([
      {
        id: 'something',
        parent: 0,
        $level: 0,
      },
      {
        id: 'something-else',
        parent: 0,
        $level: 0,
      },
    ]);
  });

  it('adds proper $level to children options', () => {
    const flatOptionTree = makeFlatOptionTree([
      {
        id: 'a',
        parent: 0,
      },
      {
        id: 'b',
        parent: 0,
      },
      {
        id: 'aa',
        parent: 'a',
      },
      {
        id: 'bb',
        parent: 'b',
      },
      {
        id: 'ab',
        parent: 'a',
      },
      {
        id: 'bbb',
        parent: 'bb',
      },
    ]);

    expect(flatOptionTree).toStrictEqual([
      {
        id: 'a',
        parent: 0,
        $level: 0,
      },
      {
        id: 'aa',
        parent: 'a',
        $level: 1,
      },
      {
        id: 'ab',
        parent: 'a',
        $level: 1,
      },
      {
        id: 'b',
        parent: 0,
        $level: 0,
      },
      {
        id: 'bb',
        parent: 'b',
        $level: 1,
      },
      {
        id: 'bbb',
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
        parent: 0,
      },
      {
        id: 'b',
        parent: 0,
      },
      {
        id: 'aa',
        parent: 'a',
      },
      {
        id: 'bb',
        parent: 'b',
      },
      {
        id: 'ab',
        parent: 'a',
      },
      {
        id: 'bbb',
        parent: 'bb',
      },
    ]);

    const getIndex = (id) => flatOptionTree.findIndex(findOpt(id));
    const isInOrder = (...args) =>
      args.every(
        (el, i, _args) => i === 0 || getIndex(_args[i - 1]) < getIndex(el)
      );

    // sibling order doesn't matter, so that's why we dont
    // test aa vs ab
    expect(isInOrder('a', 'aa', 'b', 'bb', 'bbb')).toBeTrue();
    expect(isInOrder('a', 'ab', 'b', 'bb', 'bbb')).toBeTrue();
  });
});
