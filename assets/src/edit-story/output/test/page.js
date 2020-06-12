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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import PageOutput from '../page';
import { queryByAutoAdvanceAfter, queryById } from '../../testUtils';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';
import { OverlayType } from '../../utils/backgroundOverlay';

describe('Page output', () => {
  describe('aspect-ratio markup', () => {
    let backgroundElement;

    beforeEach(() => {
      backgroundElement = {
        isBackground: true,
        id: 'baz',
        type: 'image',
        mimeType: 'image/png',
        scale: 1,
        origRatio: 9 / 16,
        x: 50,
        y: 100,
        height: 1920,
        width: 1080,
        rotationAngle: 0,
        loop: true,
        resource: {
          type: 'image',
          mimeType: 'image/png',
          id: 123,
          src: 'https://example.com/image.png',
          poster: 'https://example.com/poster.png',
          height: 1920,
          width: 1080,
        },
      };
    });

    it('should render a single layer with no background', () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const layers = container.querySelectorAll('amp-story-grid-layer');
      expect(layers).toHaveLength(1);
      const layer = layers[0];
      expect(layer).toHaveAttribute(
        'aspect-ratio',
        `${PAGE_WIDTH}:${PAGE_HEIGHT}`
      );
      expect(layer.firstElementChild.className).toStrictEqual(
        'page-fullbleed-area'
      );
      expect(layer.firstElementChild.firstElementChild.className).toStrictEqual(
        'page-safe-area'
      );
    });

    it('should render the layer for background with overlay', () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [backgroundElement],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const layers = container.querySelectorAll('amp-story-grid-layer');
      expect(layers).toHaveLength(2);
      const bgLayer = layers[0];
      expect(bgLayer).toHaveAttribute(
        'aspect-ratio',
        `${PAGE_WIDTH}:${PAGE_HEIGHT}`
      );
      expect(bgLayer.children).toHaveLength(1);
      expect(bgLayer.children[0].className).toStrictEqual(
        'page-fullbleed-area'
      );
      expect(bgLayer.children[0].children[0].className).toStrictEqual(
        'page-safe-area'
      );
    });

    it('should render the layer for background', () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [backgroundElement],
          backgroundOverlay: OverlayType.LINEAR,
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const layers = container.querySelectorAll('amp-story-grid-layer');
      expect(layers).toHaveLength(2);
      const bgLayer = layers[0];
      expect(bgLayer).toHaveAttribute(
        'aspect-ratio',
        `${PAGE_WIDTH}:${PAGE_HEIGHT}`
      );
      expect(bgLayer.children).toHaveLength(2);
      expect(bgLayer.children[0].className).toStrictEqual(
        'page-fullbleed-area'
      );
      expect(bgLayer.children[1].className).toStrictEqual(
        'page-fullbleed-area'
      );
    });
  });

  describe('autoAdvance', () => {
    it('should use default value for auto-advance-after', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      await expect(
        queryByAutoAdvanceAfter(container, '7s')
      ).not.toBeInTheDocument();
    });

    it('should use default duration for auto-advance-after', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
        },
        autoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      await expect(
        queryByAutoAdvanceAfter(container, '7s')
      ).toBeInTheDocument();
    });

    it('should use default duration for images', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            {
              id: 'baz',
              type: 'image',
              mimeType: 'image/png',
              scale: 1,
              origRatio: 9 / 16,
              x: 50,
              y: 100,
              height: 1920,
              width: 1080,
              rotationAngle: 0,
              loop: true,
              resource: {
                type: 'image',
                mimeType: 'image/png',
                id: 123,
                src: 'https://example.com/image.png',
                poster: 'https://example.com/poster.png',
                height: 1920,
                width: 1080,
              },
            },
          ],
        },
        autoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      await expect(
        queryByAutoAdvanceAfter(container, '7s')
      ).toBeInTheDocument();
    });

    it('should use video element ID for auto-advance-after', async () => {
      const props = {
        id: 'foo',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          elements: [
            {
              id: 'baz',
              type: 'video',
              mimeType: 'video/mp4',
              scale: 1,
              origRatio: 9 / 16,
              x: 50,
              y: 100,
              height: 1920,
              width: 1080,
              rotationAngle: 0,
              loop: false,
              resource: {
                type: 'video',
                mimeType: 'video/mp4',
                id: 123,
                src: 'https://example.com/video.mp4',
                poster: 'https://example.com/poster.png',
                height: 1920,
                width: 1080,
                length: 99,
              },
            },
          ],
        },
        autoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const video = queryById(container, 'el-baz-media');
      await expect(video).toBeInTheDocument();
      expect(video).toMatchInlineSnapshot(`
        <amp-video
          artwork="https://example.com/poster.png"
          autoplay="autoplay"
          id="el-baz-media"
          layout="fill"
          poster="https://example.com/poster.png"
        >
          <source
            src="https://example.com/video.mp4"
            type="video/mp4"
          />
        </amp-video>
      `);
      await expect(
        queryByAutoAdvanceAfter(container, 'el-baz-media')
      ).toBeInTheDocument();
    });

    it('should ignore looping video for auto-advance-after and set default instead', async () => {
      const props = {
        id: 'foo',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          elements: [
            {
              id: 'baz',
              type: 'video',
              mimeType: 'video/mp4',
              scale: 1,
              origRatio: 9 / 16,
              x: 50,
              y: 100,
              height: 1920,
              width: 1080,
              rotationAngle: 0,
              loop: true,
              resource: {
                type: 'video',
                mimeType: 'video/mp4',
                id: 123,
                src: 'https://example.com/video.mp4',
                poster: 'https://example.com/poster.png',
                height: 1920,
                width: 1080,
                length: 99,
              },
            },
          ],
        },
        autoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      await expect(
        queryByAutoAdvanceAfter(container, '7s')
      ).toBeInTheDocument();
    });
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
        },
        autoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });

    it('should produce valid AMP output with manual page advancement', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
        },
        autoAdvance: false,
      };

      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });

    describe('AMP validation', () => {
      it('should produce valid output with media elements', async () => {
        const props = {
          id: '123',
          backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
          page: {
            id: '123',
            elements: [
              {
                id: '123',
                type: 'video',
                mimeType: 'video/mp4',
                scale: 1,
                origRatio: 9 / 16,
                x: 50,
                y: 100,
                height: 1920,
                width: 1080,
                rotationAngle: 0,
                loop: true,
                resource: {
                  type: 'video',
                  mimeType: 'video/mp4',
                  id: 123,
                  src: 'https://example.com/image.png',
                  poster: 'https://example.com/poster.png',
                  height: 1920,
                  width: 1080,
                  length: 99,
                },
              },
            ],
          },
          autoAdvance: true,
          defaultPageDuration: 11,
        };

        await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
      });
    });
  });
});
