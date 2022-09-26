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
          sourceUrl: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          sourceUrl: 'URL2',
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
          sourceUrl: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          sourceUrl: 'URL2',
          width: 400,
          height: 800,
        },
        size3: {
          sourceUrl: 'URL3',
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
          sourceUrl: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          sourceUrl: 'URL2',
          width: 400,
          height: 800,
        },
        size3: {
          sourceUrl: 'URL3',
          width: 200,
          height: 400,
        },
        size4: {
          sourceUrl: 'URL3',
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
        img1: { height: 100, sourceUrl: 'small-url' },
        img2: { width: 300, height: 150 },
        img3: { width: 400, height: 200, sourceUrl: 'large-url' },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('large-url 400w');
  });

  it('should encode URLs with spaces', () => {
    const resource = {
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: { width: 100, height: 100, sourceUrl: 'small url' },
        img2: { width: 200, height: 200, sourceUrl: 'medium url' },
        img3: { width: 300, height: 300, sourceUrl: 'large url' },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('large%20url 300w,medium%20url 200w,small%20url 100w');
  });

  it('should not encode already encoded URLs', () => {
    const resource = {
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: {
          width: 100,
          height: 100,
          sourceUrl:
            'https://firebasestorage.googleapis.com/v0/b/c-dashboard-d4a82.appspot.com/o/media%2FNurUn5ekSeOkSCfk1yPIkg17buI3%2Fimages%2F1650068451121-omid-armin-nACf6L_pXq8-unsplash.jpeg?alt=media&token=edc4dfd7-6ac1-44a0-83b7-1aa99a3adad3',
        },
        img2: { width: 200, height: 200, sourceUrl: 'medium%2Furl' },
        img3: { width: 300, height: 300, sourceUrl: 'large%2Furl' },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'large%2Furl 300w,medium%2Furl 200w,https://firebasestorage.googleapis.com/v0/b/c-dashboard-d4a82.appspot.com/o/media%2FNurUn5ekSeOkSCfk1yPIkg17buI3%2Fimages%2F1650068451121-omid-armin-nACf6L_pXq8-unsplash.jpeg?alt=media&token=edc4dfd7-6ac1-44a0-83b7-1aa99a3adad3 100w'
    );
  });

  it('should encode URLs with multiple spaces', () => {
    const resource = {
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: { width: 100, height: 100, sourceUrl: 'small      url' },
        img2: { width: 200, height: 200, sourceUrl: 'medium     url' },
        img3: { width: 300, height: 300, sourceUrl: 'large      url' },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'large%20%20%20%20%20%20url 300w,medium%20%20%20%20%20url 200w,small%20%20%20%20%20%20url 100w'
    );
  });

  it('should ignore sizes with empty URLs', () => {
    const resource = {
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: { width: 100, height: 100, sourceUrl: '' },
        img2: { width: 200, height: 200, sourceUrl: '' },
        img3: { width: 300, height: 300, sourceUrl: '' },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('');
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
          sourceUrl: 'image-300x300.jpg',
        },
        medium: {
          width: 225,
          height: 300,
          sourceUrl: 'image-225x300.jpg',
        },
        medium_large: {
          width: 768,
          height: 1024,
          sourceUrl: 'image-768x1024.jpg',
        },
        large: {
          width: 768,
          height: 1024,
          sourceUrl: 'image-768x1024.jpg',
        },
        'rss-image': {
          width: 225,
          height: 300,
          sourceUrl: 'image-225x300.jpg',
        },
        'featured-long': {
          width: 600,
          height: 850,
          sourceUrl: 'image-600x850.jpg',
        },
        'featured-wide': {
          width: 800,
          height: 560,
          sourceUrl: 'image-800x560.jpg',
        },
        'featured-square': {
          width: 600,
          height: 600,
          sourceUrl: 'image-600x600.jpg',
        },
        'single-post-featured': {
          width: 1000,
          height: 500,
          sourceUrl: 'image-1000x500.jpg',
        },
        wp_rp_thumbnail: {
          width: 400,
          height: 400,
          sourceUrl: 'image-400x400.jpg',
        },
        thumbnail_old_300x300: {
          width: '300',
          height: '300',
          sourceUrl: 'image-300x300.jpg',
        },
        medium_old_225x300: {
          width: '225',
          height: '300',
          sourceUrl: 'image-225x300.jpg',
        },
        medium_large_old_768x1024: {
          width: '768',
          height: '1024',
          sourceUrl: 'image-768x1024.jpg',
        },
        large_old_768x1024: {
          width: '768',
          height: '1024',
          sourceUrl: 'image-768x1024.jpg',
        },
        'rss-image_old_225x300': {
          width: '225',
          height: '300',
          sourceUrl: 'image-225x300.jpg',
        },
        'square-entry-image': {
          width: '400',
          height: '400',
          sourceUrl: 'image-400x400.jpg',
        },
        'vertical-entry-image': {
          width: '600',
          height: '850',
          sourceUrl: 'image-600x850.jpg',
        },
        'small-vertical-entry-image': {
          width: '150',
          height: '200',
          sourceUrl: 'image-150x200.jpg',
        },
        'horizontal-entry-image': {
          width: '775',
          height: '500',
          sourceUrl: 'image-775x500.jpg',
        },
        wp_rp_thumbnail_old_400x400: {
          width: '400',
          height: '400',
          sourceUrl: 'image-400x400.jpg',
        },
        full: {
          width: 1000,
          height: 1333,
          sourceUrl: 'image.jpg',
        },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'image.jpg 1000w,image-768x1024.jpg 768w,image-225x300.jpg 225w,image-150x200.jpg 150w'
    );
  });

  it('should not break image URLs with commas in them', () => {
    const resource = {
      src: 'image.jpg',
      width: 640,
      height: 853,
      sizes: {
        thumbnail: {
          width: 150,
          height: 200,
          sourceUrl:
            'https://example.com/images/w_150,h_200,c_scale/image.jpg?_i=AA',
        },
        medium: {
          width: 225,
          height: 300,
          sourceUrl:
            'https://example.com/images/w_225,h_300,c_scale/image.jpg?_i=AA',
        },
        full: {
          width: 640,
          height: 853,
          sourceUrl:
            'https://example.com/images/w_640,h_853,c_scale/image.jpg?_i=AA',
        },
      },
    };

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'https://example.com/images/w_640%2Ch_853%2Cc_scale/image.jpg?_i=AA 640w,' +
        'https://example.com/images/w_225%2Ch_300%2Cc_scale/image.jpg?_i=AA 225w,' +
        'https://example.com/images/w_150%2Ch_200%2Cc_scale/image.jpg?_i=AA 150w'
    );
  });
});
