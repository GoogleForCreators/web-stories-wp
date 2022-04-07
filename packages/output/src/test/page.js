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
import { renderToStaticMarkup } from '@googleforcreators/react';
import { render } from '@testing-library/react';
import { useFeature } from 'flagged';
import { PAGE_WIDTH, PAGE_HEIGHT } from '@googleforcreators/units';
import { MaskTypes } from '@googleforcreators/masks';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';
import {
  queryByAutoAdvanceAfter,
  getByAutoAdvanceAfter,
  queryById,
  getById,
} from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import PageOutput from '../page';

jest.mock('flagged');

const PRODUCT_LAMP = {
  productUrl: 'https://www.google.com',
  productId: 'lamp',
  productTitle: 'Brass Lamp',
  productBrand: 'Lamp Co',
  productPrice: 799.0,
  productPriceCurrency: 'USD',
  productImages: [
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'lamp 1' },
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'lamp 2' },
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'lamp 3' },
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'lamp 4' },
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'lamp 5' },
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'lamp 6' },
  ],
  aggregateRating: {
    ratingValue: 4.4,
    reviewCount: 89,
    reviewUrl: 'https://www.google.com',
  },
  productDetails:
    'One newline after this. \n Two newlines after this. \n\n  Five consecutive newlines after this, should become 2 newlines. \n\n\n\n\n Many consecutive newlines with different spacing and tabs after this, should become 2 newlines. \n          \n\n   \n  \n \n  \n \n I hope it works!',
};

const PRODUCT_ART = {
  productUrl: 'https://www.google.com',
  productId: 'art',
  productTitle: 'Abstract Art',
  productBrand: 'V. Artsy',
  productPrice: 1200.0,
  productPriceCurrency: 'INR',
  productImages: [
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'art' },
  ],
  aggregateRating: {
    ratingValue: 4.4,
    reviewCount: 89,
    reviewUrl: 'https://www.google.com',
  },
};

const PRODUCT_CHAIR = {
  productUrl: 'https://www.google.com',
  productId: 'chair',
  productTitle: 'Yellow chair',
  productPrice: 1000.0,
  productPriceCurrency: 'BRL',
  productText: 'The perfectly imperfect yellow chair',
  productImages: [
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'chair' },
  ],
  aggregateRating: {
    ratingValue: 4.4,
    reviewCount: 89,
    reviewUrl: 'https://www.google.com',
  },
  productDetails:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere error deserunt dignissimos in laborum ea molestias veritatis sint laudantium iusto expedita atque provident doloremque, ad voluptatem culpa adipisci.',
};

const PRODUCT_FLOWERS = {
  productUrl: 'https://www.google.com',
  productId: 'flowers',
  productTitle: 'Flowers',
  productBrand: 'Very Long Flower Company Name',
  productPrice: 10.0,
  productPriceCurrency: 'USD',
  productIcon: '/examples/visual-tests/amp-story/img/shopping/icon.png',
  productImages: [
    { url: '/examples/visual-tests/amp-story/img/cat1.jpg', alt: 'flowers' },
  ],
  aggregateRating: {
    ratingValue: 4.4,
    reviewCount: 89,
    reviewUrl: 'https://www.google.com',
  },
  productDetails:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere error deserunt dignissimos in laborum ea molestias veritatis sint laudantium iusto expedita atque provident doloremque, ad voluptatem culpa adipisci.',
};

/* eslint-disable testing-library/no-node-access, testing-library/no-container */

describe('Page output', () => {
  beforeAll(() => {
    useFeature.mockImplementation((feature) => {
      const config = {
        enableAnimation: true,
      };

      return config[feature];
    });

    elementTypes.forEach(registerElementType);
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
      expect(layer.firstElementChild.firstElementChild).toHaveClass(
        'page-safe-area',
        { exact: true }
      );
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
              overlay: { color: { r: 0, g: 255, b: 0, a: 0.4 } },
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
            {
              id: '123',
              targets: ['123', '124'],
              type: 'bounce',
              duration: 1000,
            },
            { id: '124', targets: ['123'], type: 'spin', duration: 1000 },
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
      await expect(getByAutoAdvanceAfter(container, '7s')).toBeInTheDocument();
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
      await expect(getByAutoAdvanceAfter(container, '7s')).toBeInTheDocument();
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
        getByAutoAdvanceAfter(container, 'el-baz-media')
      ).toBeInTheDocument();
    });

    it('should use video element ID for auto-advance-after if video is below defaultPageDuration', async () => {
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
                length: 1,
              },
            },
          ],
        },
        autoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const video = getById(container, 'el-baz-media');
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
        getByAutoAdvanceAfter(container, 'el-baz-media')
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
      await expect(getByAutoAdvanceAfter(container, '7s')).toBeInTheDocument();
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
            theme: 'dark',
            icon: 'https://example.test/example.jpg',
          },
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      await expect(pageOutlink).toHaveTextContent('Click me!');
      await expect(pageOutlink).toHaveAttribute(
        'cta-image',
        'https://example.test/example.jpg'
      );
      await expect(pageOutlink).toHaveAttribute('theme', 'dark');
      await expect(pageOutlink.firstChild).toHaveAttribute(
        'href',
        'https://example.test'
      );
      await expect(pageOutlink).toBeInTheDocument();
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
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      await expect(pageOutlink).not.toBeInTheDocument();
    });

    it('should not output cta-image if empty', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Click me!',
            theme: 'dark',
            icon: '',
          },
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      await expect(pageOutlink).toHaveTextContent('Click me!');
      await expect(pageOutlink).not.toHaveAttribute('cta-image');
      await expect(pageOutlink).toBeInTheDocument();
    });

    it('should output rel', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Click me!',
            theme: 'dark',
            icon: '',
            rel: ['nofollow'],
          },
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      await expect(pageOutlink).toBeInTheDocument();
      await expect(pageOutlink).toHaveTextContent('Click me!');
      await expect(pageOutlink).not.toHaveAttribute('cta-image');

      const pageOutATag = pageOutlink.querySelector('a');
      await expect(pageOutATag).toBeInTheDocument();
      await expect(pageOutATag).toHaveAttribute('rel', 'nofollow');
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

    it('should print page attachment as the last child element', () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          pageAttachment: {
            url: 'http://example.com',
            ctaText: 'Click me!',
          },
          animations: [],
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
              tracks: [
                {
                  track: 'https://example.com/track.vtt',
                  trackId: 123,
                  trackName: 'track.vtt',
                  id: 'rersd-fdfd-fdfd-fdfd',
                  srcLang: '',
                  label: '',
                  kind: 'captions',
                },
              ],
            },
          ],
        },
        autoAdvance: true,
        defaultPageDuration: 11,
      };

      const { container } = render(<PageOutput {...props} />);
      const page = container.querySelector('amp-story-page');
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      expect(pageOutlink).toBeInTheDocument();
      expect(page.lastChild).toBe(pageOutlink);
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
        baseColor: '#00379b',
      },
    };

    it('should output background media base color if available', () => {
      const props = {
        id: '123',
        page: {
          backgroundColor: { color: '#00379b' },
          id: '123',
          elements: [BACKGROUND_ELEMENT],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('background-color:#00379b');
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
              rotationAngle: 0,
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

  describe('overlay', () => {
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

    it('should output image with linear overlay if set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...MEDIA_ELEMENT,
              overlay: {
                type: 'linear',
                rotation: 0,
                stops: [
                  { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
                  { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
                ],
                alpha: 0.7,
              },
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain(
        'background-image:linear-gradient(0.5turn, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)'
      );
    });

    it('should output video with solid overlay if set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...MEDIA_ELEMENT,
              type: 'video',
              overlay: {
                color: { r: 0, g: 0, b: 0, a: 0.5 },
              },
            },
          ],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain('background-color:rgba(0,0,0,0.5)');
    });
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

    it('should not output border radius if the element is not rectangular', () => {
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

  describe('background audio', () => {
    it('should add background audio', () => {
      const props = {
        id: '123',
        page: {
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
              length: 100,
              lengthFormatted: '1:40',
            },
            tracks: [],
          },
          id: '123',
          elements: [],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(<PageOutput {...props} />);
      expect(content).toContain(
        'background-audio="https://example.com/audio.mp3"'
      );
      expect(content).not.toContain('amp-video');
    });
    it('should add background audio as amp-video', async () => {
      const props = {
        id: '123',
        page: {
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
              length: 100,
              lengthFormatted: '1:40',
            },
            tracks: [
              {
                track: 'https://example.com/track.vtt',
                trackId: 123,
                trackName: 'track.vtt',
                id: 'rersd-fdfd-fdfd-fdfd',
                srcLang: '',
                label: '',
                kind: 'captions',
              },
            ],
            loop: true,
          },
          id: '123',
          elements: [],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);

      const captions = container.querySelector('amp-story-captions');
      await expect(captions).toBeInTheDocument();
      expect(captions).toMatchSnapshot();
      expect(captions).toHaveAttribute('id', 'el-123-captions');

      const video = container.querySelector('amp-video');
      await expect(video).toBeInTheDocument();
      expect(video).toMatchSnapshot();
      expect(video).toHaveAttribute('captions-id', 'el-123-captions');

      const page = container.querySelector('amp-story-page');
      await expect(page).toBeInTheDocument();
      expect(page).not.toContain(
        'background-audio="https://example.com/audio.mp3"'
      );
    });

    it('should use amp-video for non-looping background audio', async () => {
      const props = {
        id: '123',
        page: {
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
              length: 100,
              lengthFormatted: '1:40',
            },
            tracks: [],
            loop: false,
          },
          id: '123',
          elements: [],
        },
        autoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const video = container.querySelector('amp-video');
      await expect(video).toBeInTheDocument();
      expect(video).toMatchSnapshot();

      const page = container.querySelector('amp-story-page');
      await expect(page).toBeInTheDocument();
      expect(page).not.toContain(
        'background-audio="https://example.com/audio.mp3"'
      );
    });
  });

  describe('video captions', () => {
    it('should render layer for amp-story-captions', async () => {
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
              tracks: [
                {
                  track: 'https://example.com/track.vtt',
                  trackId: 123,
                  trackName: 'track.vtt',
                  id: 'rersd-fdfd-fdfd-fdfd',
                  srcLang: '',
                  label: '',
                  kind: 'captions',
                },
              ],
            },
          ],
        },
        autoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} />);
      const video = container.querySelector('amp-story-captions');
      await expect(video).toBeInTheDocument();
      expect(video).toMatchInlineSnapshot(`
      <amp-story-captions
        height="100"
        id="el-baz-captions"
        layout="fixed-height"
      />
      `);
    });
  });

  describe('Shopping', () => {
    it('should render shopping attachment if there are products', async () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          elements: [
            {
              id: 'el1',
              type: 'product',
              x: 50,
              y: 50,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_LAMP,
            },
            {
              id: 'el2',
              type: 'product',
              x: 100,
              y: 100,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_ART,
            },
          ],
        },
        flags: {
          shoppingIntegration: true,
        },
      };

      const { container } = render(<PageOutput {...props} />);
      const shoppingAttachment = container.querySelector(
        'amp-story-shopping-attachment'
      );
      await expect(shoppingAttachment).toBeInTheDocument();
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
          animations: [
            { id: '123', targets: ['123'], type: 'bounce', duration: 1000 },
          ],
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

    it('should produce valid output with background audio', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
            },
            tracks: [],
          },
          animations: [],
          elements: [],
        },
        autoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });

    it('should produce valid output with background audio with captions', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
            },
            tracks: [
              {
                track: 'https://example.com/track.vtt',
                trackId: 123,
                trackName: 'track.vtt',
                id: 'rersd-fdfd-fdfd-fdfd',
                srcLang: '',
                label: '',
                kind: 'captions',
              },
            ],
          },
          animations: [],
          elements: [],
        },
        autoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });

    it('should produce valid output with non-looping background audio', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
              length: 100,
              lengthFormatted: '1:40',
            },
            tracks: [],
            loop: false,
          },
          animations: [],
          elements: [],
        },
        autoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });

    // eslint-disable-next-line jest/no-disabled-tests -- TODO: Enable once stable.
    it.skip('should produce valid output with shopping products', async () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          elements: [
            {
              id: 'el1',
              type: 'product',
              x: 50,
              y: 50,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_LAMP,
            },
            {
              id: 'el2',
              type: 'product',
              x: 100,
              y: 100,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_ART,
            },
            {
              id: 'el3',
              type: 'product',
              x: 150,
              y: 150,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_CHAIR,
            },
            {
              id: 'el3',
              type: 'product',
              x: 200,
              y: 200,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_FLOWERS,
            },
          ],
        },
        flags: {
          shoppingIntegration: true,
        },
      };

      await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
    });
  });
});

/* eslint-enable testing-library/no-node-access, testing-library/no-container */
