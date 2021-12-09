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
import deepMerge from '../deepMerge';

const object1 = {
  b: {
    c: {
      d: {
        e: 'e',
        f: 'f',
      },
    },
  },
  x: 'y',
  z: {
    dates: ['Jan', 'Feb'],
  },
};

const object2 = {
  a: 'a',
  b: {
    c: {
      d: {
        e: 'not e',
        g: 'g',
      },
    },
  },
  x: 'y',
  z: {
    dates: ['Jan', 'Feb', 'March'],
  },
};
const expectedResult = {
  a: 'a',
  b: {
    c: {
      d: {
        e: 'not e',
        f: 'f',
        g: 'g',
      },
    },
  },
  x: 'y',
  z: {
    dates: ['Jan', 'Feb', 'March'],
  },
};

describe('deepMerge', () => {
  it.each`
    object       | source       | result
    ${undefined} | ${undefined} | ${undefined}
    ${{}}        | ${undefined} | ${{}}
    ${object1}   | ${undefined} | ${object1}
    ${object1}   | ${{}}        | ${object1}
    ${object1}   | ${object2}   | ${expectedResult}
  `(
    'should return merged object for $object and $source',
    ({ object, source, result }) => {
      expect(deepMerge(object, source)).toStrictEqual(result);
    }
  );
});
