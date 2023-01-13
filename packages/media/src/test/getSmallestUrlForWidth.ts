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
import getSmallestUrlForWidth from '../getSmallestUrlForWidth';
import createResource from '../createResource';
import { ResourceType } from '../types';

describe('getSmallestUrlForWidth', () => {
  beforeEach(() => {
    window.devicePixelRatio = 1;
  });

  afterEach(() => {
    window.devicePixelRatio = 1;
  });

  it('should return the smallest available image URL greater than minWidth', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 400,
      height: 200,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 100,
          sourceUrl: 'full-url',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 150,
          sourceUrl: 'med-url',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 400,
          height: 200,
          sourceUrl: 'large-url',
        },
      },
    });
    expect(getSmallestUrlForWidth(210, resource)).toBe('med-url');
  });

  it('should return an image according to the device pixel ratio', () => {
    window.devicePixelRatio = 2;
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 400,
      height: 200,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 100,
          sourceUrl: 'full-url',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 150,
          sourceUrl: 'med-url',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 400,
          height: 200,
          sourceUrl: 'large-url',
        },
      },
    });
    expect(getSmallestUrlForWidth(160, resource)).toBe('large-url');
  });

  it('should return an image with the same aspect ratio', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 400,
      height: 200,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 500,
          sourceUrl: 'portrait-url',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 250,
          height: 250,
          sourceUrl: 'square-url',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 150,
          sourceUrl: 'med-url',
        },
        img4: {
          mimeType: 'image/jpeg',
          width: 400,
          height: 200,
          sourceUrl: 'large-url',
        },
      },
    });
    expect(getSmallestUrlForWidth(150, resource)).toBe('med-url');
  });

  it('should return the resource.src if there is no valid thumb', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 400,
      height: 200,
      sizes: {
        img1: {
          mimeType: 'image/jpeg',
          width: 200,
          height: 1,
          sourceUrl: 'small-url',
        },
        img2: {
          mimeType: 'image/jpeg',
          width: 300,
          height: 1,
          sourceUrl: 'med-url',
        },
        img3: {
          mimeType: 'image/jpeg',
          width: 400,
          height: 1,
          sourceUrl: 'large-url',
        },
      },
    });
    expect(getSmallestUrlForWidth(440, resource)).toBe('default-url');
  });

  it('should return the default src URL if no alternatives', () => {
    const resource = createResource({
      id: 123,
      type: ResourceType.Image,
      mimeType: 'image/jpeg',
      alt: '',
      src: 'default-url',
      width: 400,
      height: 200,
      sizes: {},
    });
    expect(getSmallestUrlForWidth(200, resource)).toBe('default-url');
  });
});
