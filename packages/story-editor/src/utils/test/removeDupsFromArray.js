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
import removeDupsFromArray from '../removeDupsFromArray';

describe('removeDupsFromArray', () => {
  it('should remove duplicates from an array of objects', () => {
    const obj1 = {
      key: '1',
      foo1: 'foo1',
      bar1: 'bar1',
    };
    const obj2 = {
      key: '2',
      foo2: 'foo2',
      bar2: 'bar2',
    };
    const obj3 = {
      key: '1',
      foo3: 'foo3',
      bar3: 'bar3',
    };
    const arr = [obj1, obj2, obj3];
    expect(removeDupsFromArray(arr, 'key')).toStrictEqual([obj1, obj2]);
  });
});
