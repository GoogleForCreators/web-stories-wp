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
import calculateSrcSet from '../calculateSrcSet';

describe('calculateSrcSet', () => {
  it('should generate srcset properly', () => {
    const resource = {
      width: 400,
      height: 800,
      sizes: {
        size1: {
          source_url: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          source_url: 'URL2',
          width: 400,
          height: 800,
        },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('URL2 400w,URL1 200w');
  });

  it("should skip images that don't match the largest image's orientation", () => {
    const resource = {
      width: 400,
      height: 800,
      sizes: {
        size1: {
          source_url: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          source_url: 'URL2',
          width: 400,
          height: 800,
        },
        size3: {
          source_url: 'URL3',
          width: 400,
          height: 410,
        },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('URL2 400w,URL1 200w');
  });

  it('should remove duplicate width images', () => {
    const resource = {
      width: 800,
      height: 1600,
      sizes: {
        size1: {
          source_url: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          source_url: 'URL2',
          width: 400,
          height: 800,
        },
        size3: {
          source_url: 'URL3',
          width: 200,
          height: 400,
        },
        size4: {
          source_url: 'URL3',
          width: 800,
          height: 1600,
        },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('URL3 800w,URL2 400w,URL1 200w');
  });

  it('should skip sizes that are invalid', () => {
    const resource = {
      src: 'default-url',
      width: 400,
      height: 200,
      sizes: {
        img1: { height: 100, source_url: 'small-url' },
        img2: { width: 300, height: 150 },
        img3: { width: 400, height: 200, source_url: 'large-url' },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('large-url 400w');
  });
});
