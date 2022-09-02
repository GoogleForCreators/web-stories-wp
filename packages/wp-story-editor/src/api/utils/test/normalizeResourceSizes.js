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
        mimeType: 'image/jpeg',
        width: '300',
        height: '300',
        sourceUrl: 'image-300x300.jpg',
      },
      size2: {
        mimeType: 'image/jpeg',
        width: '600',
        height: '600',
        sourceUrl: 'image-600x600.jpg',
      },
      size3: {
        mimeType: 'image/jpeg',
        width: '900',
        height: '900',
        sourceUrl: 'image-900x900.jpg',
      },
    };
    const expected = {
      size1: {
        mimeType: 'image/jpeg',
        width: 300,
        height: 300,
        sourceUrl: 'image-300x300.jpg',
      },
      size2: {
        mimeType: 'image/jpeg',
        width: 600,
        height: 600,
        sourceUrl: 'image-600x600.jpg',
      },
      size3: {
        mimeType: 'image/jpeg',
        width: 900,
        height: 900,
        sourceUrl: 'image-900x900.jpg',
      },
    };

    expect(normalizeResourceSizes(sizes)).toStrictEqual(expected);
  });

  it('should skip sizes that are invalid', () => {
    const sizes = {
      img1: { mimeType: 'image/jpeg', height: 100, sourceUrl: 'small-url' },
      img2: {
        mimeType: 'image/jpeg',
        width: 300,
        height: 150,
        sourceUrl: '',
      },
      img3: {
        mimeType: 'image/jpeg',
        width: 400,
        height: 200,
        sourceUrl: 'medium-url',
      },
      img4: {
        mimeType: 'image/jpeg',
        width: 800,
        height: 400,
        sourceUrl: 'large-url',
      },
      img5: {
        mimeType: 'image/jpeg',
        width: 300,
        height: 150,
      },
      img6: { mimeType: 'image/jpeg', width: 100, sourceUrl: 'small-url' },
    };

    const expected = {
      img3: {
        mimeType: 'image/jpeg',
        width: 400,
        height: 200,
        sourceUrl: 'medium-url',
      },
      img4: {
        mimeType: 'image/jpeg',
        width: 800,
        height: 400,
        sourceUrl: 'large-url',
      },
    };

    expect(normalizeResourceSizes(sizes)).toStrictEqual(expected);
  });
});
