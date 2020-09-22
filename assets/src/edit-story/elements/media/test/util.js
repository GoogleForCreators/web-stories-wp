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
import { getSmallestUrlForWidth, calculateSrcSet } from '../util';

describe('util', () => {
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

  describe('getSmallestUrlForWidth', () => {
    beforeEach(() => {
      window.devicePixelRatio = 1;
    });

    it('should return the smallest available image URL greater than minWidth', () => {
      const resource = {
        src: 'default-url',
        width: 400,
        height: 200,
        sizes: {
          img1: { width: 200, height: 100, source_url: 'full-url' },
          img2: { width: 300, height: 150, source_url: 'med-url' },
          img3: { width: 400, height: 200, source_url: 'large-url' },
        },
      };
      expect(getSmallestUrlForWidth(210, resource)).toBe('med-url');
    });

    it('should return an image according to the device pixel ratio', () => {
      window.devicePixelRatio = 2;
      const resource = {
        src: 'default-url',
        width: 400,
        height: 200,
        sizes: {
          img1: { width: 200, height: 100, source_url: 'full-url' },
          img2: { width: 300, height: 150, source_url: 'med-url' },
          img3: { width: 400, height: 200, source_url: 'large-url' },
        },
      };
      expect(getSmallestUrlForWidth(160, resource)).toBe('large-url');
    });

    it('should return an image with the same aspect ratio', () => {
      const resource = {
        src: 'default-url',
        width: 400,
        height: 200,
        sizes: {
          img1: { width: 200, height: 500, source_url: 'portrait-url' },
          img2: { width: 250, height: 250, source_url: 'square-url' },
          img3: { width: 300, height: 150, source_url: 'med-url' },
          img4: { width: 400, height: 200, source_url: 'large-url' },
        },
      };
      expect(getSmallestUrlForWidth(150, resource)).toBe('med-url');
    });

    it('should return the resource.src if there is no valid thumb', () => {
      const resource = {
        src: 'default-url',
        width: 400,
        height: 200,
        sizes: {
          img1: { width: 200, height: 1, source_url: 'small-url' },
          img2: { width: 300, height: 1, source_url: 'med-url' },
          img3: { width: 400, height: 1, source_url: 'large-url' },
        },
      };
      expect(getSmallestUrlForWidth(440, resource)).toBe('default-url');
    });

    it('should return the default src URL if no alternatives', () => {
      const resource = {
        src: 'default-url',
        width: 400,
        height: 200,
      };
      expect(getSmallestUrlForWidth(200, resource)).toBe('default-url');
    });
  });
});
