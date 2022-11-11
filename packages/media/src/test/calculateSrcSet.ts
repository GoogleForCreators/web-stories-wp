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
import createResource from '../createResource';
import { ResourceType } from '../types';

describe('calculateSrcSet', () => {
  it('should generate srcset properly', () => {
    const resource = createResource({
      id: 123,
      width: 400,
      height: 800,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      src: 'URL',
      alt: '',
      sizes: {
        size1: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL2',
          width: 400,
          height: 800,
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('URL2 400w,URL1 200w');
  });

  it("should skip images that don't match the largest image's orientation", () => {
    const resource = createResource({
      id: 123,
      width: 400,
      height: 800,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      src: 'URL',
      alt: '',
      sizes: {
        size1: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL2',
          width: 400,
          height: 800,
        },
        size3: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL3',
          width: 400,
          height: 410,
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('URL2 400w,URL1 200w');
  });

  it('should remove duplicate width images', () => {
    const resource = createResource({
      id: 123,
      width: 800,
      height: 1600,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      src: 'URL',
      alt: '',
      sizes: {
        size1: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL1',
          width: 200,
          height: 400,
        },
        size2: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL2',
          width: 400,
          height: 800,
        },
        size3: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL3',
          width: 200,
          height: 400,
        },
        size4: {
          mimeType: 'image/jpeg',
          sourceUrl: 'URL3',
          width: 800,
          height: 1600,
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('URL3 800w,URL2 400w,URL1 200w');
  });

  it('should encode URLs with spaces', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 100,
          height: 100,
          sourceUrl: 'small url',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 200,
          sourceUrl: 'medium url',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 300,
          sourceUrl: 'large url',
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('large%20url 300w,medium%20url 200w,small%20url 100w');
  });

  it('should not encode already encoded URLs', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 100,
          height: 100,
          sourceUrl:
            'https://firebasestorage.googleapis.com/v0/b/c-dashboard-d4a82.appspot.com/o/media%2FNurUn5ekSeOkSCfk1yPIkg17buI3%2Fimages%2F1650068451121-omid-armin-nACf6L_pXq8-unsplash.jpeg?alt=media&token=edc4dfd7-6ac1-44a0-83b7-1aa99a3adad3',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 200,
          sourceUrl: 'medium%2Furl',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 300,
          sourceUrl: 'large%2Furl',
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'large%2Furl 300w,medium%2Furl 200w,https://firebasestorage.googleapis.com/v0/b/c-dashboard-d4a82.appspot.com/o/media%2FNurUn5ekSeOkSCfk1yPIkg17buI3%2Fimages%2F1650068451121-omid-armin-nACf6L_pXq8-unsplash.jpeg?alt=media&token=edc4dfd7-6ac1-44a0-83b7-1aa99a3adad3 100w'
    );
  });

  it('should encode URLs with multiple spaces', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 100,
          height: 100,
          sourceUrl: 'small      url',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 200,
          sourceUrl: 'medium     url',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 300,
          sourceUrl: 'large      url',
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'large%20%20%20%20%20%20url 300w,medium%20%20%20%20%20url 200w,small%20%20%20%20%20%20url 100w'
    );
  });

  it('should ignore sizes with empty URLs', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 500,
      height: 500,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 100,
          height: 100,
          sourceUrl: '',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 200,
          sourceUrl: '',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 300,
          sourceUrl: '',
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe('');
  });

  it('should not break image URLs with commas in them', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'image.jpg',
      width: 640,
      height: 853,
      sizes: {
        thumbnail: {
          mimeType: 'image/jpeg',
          width: 150,
          height: 200,
          sourceUrl:
            'https://example.com/images/w_150,h_200,c_scale/image.jpg?_i=AA',
        },
        medium: {
          mimeType: 'image/jpeg',
          width: 225,
          height: 300,
          sourceUrl:
            'https://example.com/images/w_225,h_300,c_scale/image.jpg?_i=AA',
        },
        full: {
          mimeType: 'image/jpeg',
          width: 640,
          height: 853,
          sourceUrl:
            'https://example.com/images/w_640,h_853,c_scale/image.jpg?_i=AA',
        },
      },
    });

    const srcSet = calculateSrcSet(resource);
    expect(srcSet).toBe(
      'https://example.com/images/w_640%2Ch_853%2Cc_scale/image.jpg?_i=AA 640w,' +
        'https://example.com/images/w_225%2Ch_300%2Cc_scale/image.jpg?_i=AA 225w,' +
        'https://example.com/images/w_150%2Ch_200%2Cc_scale/image.jpg?_i=AA 150w'
    );
  });
});
