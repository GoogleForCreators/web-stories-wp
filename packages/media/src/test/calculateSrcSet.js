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

  it('should convert strings when checking for duplicates', () => {
    const resource = {
      src: 'image.jpg',
      width: 1000,
      height: 1333,
      sizes: {
        thumbnail: {
          width: 300,
          height: 300,
          source_url: 'image-300x300.jpg',
        },
        medium: {
          width: 225,
          height: 300,
          source_url: 'image-225x300.jpg',
        },
        medium_large: {
          width: 768,
          height: 1024,
          source_url: 'image-768x1024.jpg',
        },
        large: {
          width: 768,
          height: 1024,
          source_url: 'image-768x1024.jpg',
        },
        'rss-image': {
          width: 225,
          height: 300,
          source_url: 'image-225x300.jpg',
        },
        'featured-long': {
          width: 600,
          height: 850,
          source_url: 'image-600x850.jpg',
        },
        'featured-wide': {
          width: 800,
          height: 560,
          source_url: 'image-800x560.jpg',
        },
        'featured-square': {
          width: 600,
          height: 600,
          source_url: 'image-600x600.jpg',
        },
        'single-post-featured': {
          width: 1000,
          height: 500,
          source_url: 'image-1000x500.jpg',
        },
        wp_rp_thumbnail: {
          width: 400,
          height: 400,
          source_url: 'image-400x400.jpg',
        },
        thumbnail_old_300x300: {
          width: '300',
          height: '300',
          source_url: 'image-300x300.jpg',
        },
        medium_old_225x300: {
          width: '225',
          height: '300',
          source_url: 'image-225x300.jpg',
        },
        medium_large_old_768x1024: {
          width: '768',
          height: '1024',
          source_url: 'image-768x1024.jpg',
        },
        large_old_768x1024: {
          width: '768',
          height: '1024',
          source_url: 'image-768x1024.jpg',
        },
        'rss-image_old_225x300': {
          width: '225',
          height: '300',
          source_url: 'image-225x300.jpg',
        },
        'square-entry-image': {
          width: '400',
          height: '400',
          source_url: 'image-400x400.jpg',
        },
        'vertical-entry-image': {
          width: '600',
          height: '850',
          source_url: 'image-600x850.jpg',
        },
        'small-vertical-entry-image': {
          width: '150',
          height: '200',
          source_url: 'image-150x200.jpg',
        },
        'horizontal-entry-image': {
          width: '775',
          height: '500',
          source_url: 'image-775x500.jpg',
        },
        wp_rp_thumbnail_old_400x400: {
          width: '400',
          height: '400',
          source_url: 'image-400x400.jpg',
        },
        full: {
          width: 1000,
          height: 1333,
          source_url: 'image.jpg',
        },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'image.jpg 1000w,image-768x1024.jpg 768w,image-225x300.jpg 225w,image-150x200.jpg 150w'
    );
  });
});
