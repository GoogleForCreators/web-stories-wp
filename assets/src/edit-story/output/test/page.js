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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * External dependencies
 */
import { render } from '@testing-library/react';
jest.mock('flagged');
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import PageOutput from '../page';
import { queryByAutoAdvanceAfter, queryById } from '../../testUtils';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';
import { MaskTypes } from '../../masks';

describe('Page output', () => {
  useFeature.mockImplementation((feature) => {
    const config = {
      enableAnimation: true,
    };

    return config[feature];
  });

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
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
      expect(layer.firstElementChild).toHaveClass('page-fullbleed-area', {
        exact: true,
      });
      expect(
        layer.firstElementChild.firstElementChild
      ).toHaveClass('page-safe-area', { exact: true });
    });

    it('should render the layer for background', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
      expect(bgLayer.children[0]).toHaveClass('page-fullbleed-area', {
        exact: true,
      });
      expect(bgLayer.children[0].children[0]).toHaveClass('page-safe-area', {
        exact: true,
      });
    });

    it('should render the layer for background with overlay', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            {
              ...backgroundElement,
              backgroundOverlay: { color: { r: 0, g: 255, b: 0, a: 0.4 } },
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const overlayLayer = container.querySelector(
        '.page-background-overlay-area'
      );
      expect(overlayLayer).toBeInTheDocument();
    });
  });

  describe('animation markup', () => {
    it('should render animation tags for animations', () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          animations: [
            { targets: ['123', '124'], type: 'bounce', duration: 1000 },
            { targets: ['123'], type: 'spin', duration: 1000 },
          ],
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
            {
              id: '124',
              type: 'shape',
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              backgroundColor: {
                color: {
                  r: 51,
                  g: 51,
                  b: 51,
                },
              },
              x: 249,
              y: 67,
              width: 147,
              height: 147,
              scale: 100,
              focalX: 50,
              focalY: 50,
              mask: {
                type: 'circle',
              },
            },
          ],
        },
        autoAdvance: true,
        defaultPageDuration: 11,
      };

      const { container } = render(<PageOutput {...props} />);

      const storyAnimations = container.querySelectorAll('amp-story-animation');
      expect(storyAnimations).toHaveLength(3);
      expect(storyAnimations[0]).toHaveAttribute('trigger', `visibility`);
    });
  });

  describe('autoAdvance', () => {
    it('should use default value for auto-advance-after', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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

  describe('pageAttachment', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: 'image',
      mimeType: 'image/png',
      origRatio: 1,
      x: 50,
      y: 100,
      scale: 1,
      rotationAngle: 0,
      width: 1,
      height: 1,
      resource: {
        type: 'image',
        mimeType: 'image/png',
        id: 123,
        src: 'https://example.com/image.png',
        poster: 'https://example.com/poster.png',
        height: 1,
        width: 1,
      },
    };

    const TEXT_ELEMENT = {
      id: 'baz',
      type: 'text',
      content: 'Hello, link!',
      x: 50,
      y: PAGE_HEIGHT,
      height: 300,
      width: 100,
      rotationAngle: 10,
      padding: {
        vertical: 0,
        horizontal: 0,
      },
      fontSize: 30,
      font: {
        family: 'Roboto',
        service: 'fonts.google.com',
      },
      color: {
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 0.5,
        },
      },
    };

    it('should output page attachment if the URL is set', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Click me!',
          },
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const pageAttachment = container.querySelector(
        'amp-story-page-attachment'
      );
      await expect(pageAttachment.dataset.ctaText).toStrictEqual('Click me!');
      await expect(pageAttachment).toHaveAttribute(
        'href',
        'https://example.test'
      );
      await expect(pageAttachment).toBeInTheDocument();
    });

    it('should not output page attachment if the URL is empty', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
          pageAttachment: {
            url: '',
            ctaText: 'Click me!',
          },
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const pageAttachment = container.querySelector(
        'amp-story-page-attachment'
      );
      await expect(pageAttachment).not.toBeInTheDocument();
    });

    it('should not output a link in page attachment area', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: 'http://shouldremove.com',
              },
            },
          ],
          pageAttachment: {
            url: 'http://example.com',
            ctaText: 'Click me!',
          },
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('Hello, link');
      expect(content).not.toContain('http://shouldremove.com');
    });

    it('should output a link outside of page attachment area', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: 'http://shouldoutput.com',
              },
              y: 0,
              height: 100,
            },
          ],
          pageAttachment: {
            url: 'http://example.com',
            ctaText: 'Click me!',
          },
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('Hello, link');
      expect(content).toContain('http://shouldoutput.com');
    });

    it('should output a link in page attachment area if page attachment is not set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: 'http://shouldoutput.com',
              },
            },
          ],
          pageAttachment: null,
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('Hello, link');
      expect(content).toContain('http://shouldoutput.com');
    });
  });

  describe('background color', () => {
    const BACKGROUND_ELEMENT = {
      id: 'baz',
      type: 'image',
      mimeType: 'image/png',
      origRatio: 1,
      x: 50,
      y: 100,
      scale: 1,
      rotationAngle: 0,
      width: 1,
      height: 1,
      resource: {
        type: 'image',
        mimeType: 'image/png',
        id: 123,
        src: 'https://example.com/image.png',
        poster: 'https://example.com/poster.png',
        height: 1,
        width: 1,
        baseColor: [0, 55, 155],
      },
    };

    it('should output background media base color if available', () => {
      const props = {
        id: '123',
        page: {
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          id: '123',
          elements: [BACKGROUND_ELEMENT],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('background-color:rgb(0,55,155)');
    });

    it('should output the page background color in case of default background element', () => {
      const props = {
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255, a: 0.5 } },
          elements: [
            {
              id: '123',
              type: 'shape',
              isBackground: true,
              isDefaultBackground: true,
              x: 1,
              y: 1,
              width: 1,
              height: 1,
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('background-color:rgba(255,255,255,0.5)');
    });
  });

  describe('link', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: 'image',
      mimeType: 'image/png',
      origRatio: 1,
      x: 50,
      y: 100,
      scale: 1,
      rotationAngle: 0,
      width: 1,
      height: 1,
      resource: {
        type: 'image',
        mimeType: 'image/png',
        id: 123,
        src: 'https://example.com/image.png',
        poster: 'https://example.com/poster.png',
        height: 1,
        width: 1,
      },
    };

    const TEXT_ELEMENT = {
      id: 'baz',
      type: 'text',
      content: 'Hello, link!',
      x: 50,
      y: PAGE_HEIGHT,
      height: 300,
      width: 100,
      rotationAngle: 10,
      padding: {
        vertical: 0,
        horizontal: 0,
      },
      fontSize: 30,
      font: {
        family: 'Roboto',
        service: 'fonts.google.com',
      },
      color: {
        color: {
          r: 255,
          g: 255,
          b: 255,
          a: 0.5,
        },
      },
    };

    it('should output element with link if the url is set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: 'https://hello.example',
                desc: 'Hello, example!',
                icon: 'https://hello.example/icon.png',
              },
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('Hello, example!');
      expect(content).toContain('https://hello.example');
    });

    it('should not output element link if the url is empty', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: '',
                desc: 'Hello, example!',
                icon: 'https://hello.example/icon.png',
              },
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).not.toContain('Hello, example!');
      expect(content).not.toContain('https://hello.example');
    });
  });

  describe('border', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: 'image',
      mimeType: 'image/png',
      origRatio: 1,
      x: 50,
      y: 100,
      scale: 1,
      rotationAngle: 0,
      width: 1,
      height: 1,
      resource: {
        type: 'image',
        mimeType: 'image/png',
        id: 123,
        src: 'https://example.com/image.png',
        poster: 'https://example.com/poster.png',
        height: 1,
        width: 1,
      },
    };

    const MEDIA_ELEMENT = {
      ...BACKGROUND_ELEMENT,
      isBackground: false,
      id: 'baz',
      type: 'image',
    };

    it('should output element with border if border is set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...MEDIA_ELEMENT,
              border: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                color: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
              },
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('border-width:10px 10px 10px 10px;');
      expect(content).toContain('border-color:rgba(255,255,255,1);');
    });

    it('should not output border if the element is not rectangular', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...MEDIA_ELEMENT,
              border: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                color: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
                position: 'center',
              },
              mask: {
                type: MaskTypes.CIRCLE,
              },
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).not.toContain('border-width:10px 10px 10px 10px;');
      expect(content).not.toContain('border-color:rgba(255,255,255,1);');
    });
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
        },
        autoAdvance: false,
      };

      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });

    it('should produce valid AMP output with Page Attachment', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
        },
        autoAdvance: true,
        pageAttachment: {
          url: 'http://example.com',
          ctaText: 'Click me!',
        },
      };
      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });

    describe('borderRadius', () => {
      const BACKGROUND_ELEMENT = {
        isBackground: true,
        id: 'baz',
        type: 'image',
        mimeType: 'image/png',
        origRatio: 1,
        x: 50,
        y: 100,
        scale: 1,
        rotationAngle: 0,
        width: 10,
        height: 10,
        resource: {
          type: 'image',
          mimeType: 'image/png',
          id: 123,
          src: 'https://example.com/image.png',
          poster: 'https://example.com/poster.png',
          height: 1,
          width: 1,
        },
      };

      const MEDIA_ELEMENT = {
        ...BACKGROUND_ELEMENT,
        isBackground: false,
        id: 'baz',
        type: 'image',
        borderRadius: {
          topLeft: 10,
          topRight: 20,
          bottomRight: 10,
          bottomLeft: 10,
        },
      };

      it('should output element with border radius if the radius is set', () => {
        const props = {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          page: {
            id: '123',
            elements: [BACKGROUND_ELEMENT, MEDIA_ELEMENT],
          },
          autoAdvance: false,
          defaultPageDuration: 7,
        };

        const content = renderToStaticMarkup(<PageOutput {...props} />);
        expect(content).toContain(
          'border-radius:100% 200% 100% 100% / 100% 200% 100% 100%'
        );
      });

      it('should not output border if the element is not rectangular', () => {
        const props = {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          page: {
            id: '123',
            elements: [
              BACKGROUND_ELEMENT,
              {
                ...MEDIA_ELEMENT,
                mask: {
                  type: MaskTypes.CIRCLE,
                },
              },
            ],
          },
          autoAdvance: false,
          defaultPageDuration: 7,
        };

        const content = renderToStaticMarkup(<PageOutput {...props} />);
        expect(content).not.toContain(
          'border-radius:100% 200% 100% 100% / 100% 200% 100% 100%'
        );
      });
    });

    describe('AMP validation', () => {
      it('should produce valid output with media elements', async () => {
        const props = {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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

      it('should produce valid output with animations', async () => {
        const props = {
          id: '123',
          backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
          page: {
            id: '123',
            animations: [{ targets: ['123'], type: 'bounce', duration: 1000 }],
            elements: [
              {
                type: 'text',
                id: '123',
                x: 50,
                y: 100,
                height: 1920,
                width: 1080,
                rotationAngle: 0,
                content: 'Hello World',
                color: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
                padding: {
                  horizontal: 0,
                  vertical: 0,
                },
                font: {
                  family: 'Roboto',
                  service: 'fonts.google.com',
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
