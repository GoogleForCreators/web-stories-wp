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
 * External dependencies
 */
import { FULLBLEED_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import getResourceSize from '../getResourceSize';

describe('getResourceSize', () => {
  it('return default values', () => {
    const result = getResourceSize({});
    const expected = {
      width: PAGE_WIDTH,
      height: FULLBLEED_HEIGHT,
    };
    expect(result).toStrictEqual(expected);
  });

  it('return no poster values', () => {
    const result = getResourceSize({ width: 300, height: 300 });
    const expected = {
      width: 300,
      height: 300,
    };
    expect(result).toStrictEqual(expected);
  });

  it('return with poster values', () => {
    const result = getResourceSize({
      width: 300,
      height: 300,
      posterGenerated: true,
      posterWidth: 400,
      posterHeight: 400,
    });
    const expected = {
      width: 400,
      height: 400,
    };
    expect(result).toStrictEqual(expected);
  });

  it('return with missing poster values', () => {
    const result = getResourceSize({
      width: 300,
      height: 300,
      posterWidth: 400,
      posterHeight: 400,
    });
    const expected = {
      width: 300,
      height: 300,
    };
    expect(result).toStrictEqual(expected);
  });
});
