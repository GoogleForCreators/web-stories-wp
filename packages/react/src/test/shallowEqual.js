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
import * as _shallowEqual from 'shallow-equal';
/**
 * Internal dependencies
 */
import shallowEqual from '../shallowEqual';

describe('shallowEqual', () => {
  let shallowEqualArraysSpy, shallowEqualObjectsSpy;

  beforeEach(() => {
    shallowEqualArraysSpy = jest.spyOn(_shallowEqual, 'shallowEqualArrays');
    shallowEqualObjectsSpy = jest.spyOn(_shallowEqual, 'shallowEqualObjects');
  });

  afterEach(() => {
    shallowEqualArraysSpy.mockRestore();
    shallowEqualObjectsSpy.mockRestore();
  });

  it('calls shallowEqualArrays for arrays', () => {
    shallowEqual([1], [2]);

    expect(shallowEqualObjectsSpy).not.toHaveBeenCalled();
    expect(shallowEqualArraysSpy).toHaveBeenCalledTimes(1);
  });

  it('calls shallowEqualObjects for object', () => {
    shallowEqual({ a: 1 }, { a: 1 });

    expect(shallowEqualArraysSpy).not.toHaveBeenCalled();
    expect(shallowEqualObjectsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls neither shallowEqualObjects nor shallowEqualArrays for primitives', () => {
    shallowEqual(1, 'foo');

    expect(shallowEqualArraysSpy).not.toHaveBeenCalled();
    expect(shallowEqualObjectsSpy).not.toHaveBeenCalled();
  });
});
