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
import normalizeResourceSizes from '../normalizeResourceSizes';

describe('normalizeResourceSizes', () => {
  it('normalizes resource sizes to numeric width and height', () => {
    const sizes = {
      size1: {
        width: '300',
        height: '300',
        sourceUrl: 'image-300x300.jpg',
      },
      size2: {
        width: '600',
        height: '600',
        sourceUrl: 'image-600x600.jpg',
      },
      size3: {
        width: '900',
        height: '900',
        sourceUrl: 'image-900x900.jpg',
      },
    };
    const expected = {
      size1: {
        width: 300,
        height: 300,
        sourceUrl: 'image-300x300.jpg',
      },
      size2: {
        width: 600,
        height: 600,
        sourceUrl: 'image-600x600.jpg',
      },
      size3: {
        width: 900,
        height: 900,
        sourceUrl: 'image-900x900.jpg',
      },
    };

    expect(normalizeResourceSizes(sizes)).toStrictEqual(expected);
  });
});
