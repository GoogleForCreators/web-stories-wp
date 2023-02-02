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
import { PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';
import { MaskTypes } from '@googleforcreators/masks';
import {
  BackgroundableElement,
  ElementType,
  MediaElement,
  PageAttachment,
  ProductData,
  registerElementType,
} from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';
import {
  getByAutoAdvanceAfter,
  getById,
  queryByAutoAdvanceAfter,
  queryById,
} from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import { AnimationType, StoryAnimation } from '@googleforcreators/animation';
import { Resource, ResourceType } from '@googleforcreators/media';
import PageOutput from '../page';

jest.mock('flagged');

const PRODUCT_LAMP: ProductData = {
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

const PRODUCT_ART: ProductData = {
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
  productDetails: 'Some short text',
};

const PRODUCT_CHAIR: ProductData = {
  productUrl: 'https://www.google.com',
  productId: 'chair',
  productTitle: 'Yellow chair',
  productBrand: 'The Chair Company',
  productPrice: 1000.0,
  productPriceCurrency: 'BRL',
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

const PRODUCT_FLOWERS: ProductData = {
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

describe('Page output', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  describe('aspect-ratio markup', () => {
    let backgroundElement: BackgroundableElement & MediaElement;

    beforeEach(() => {
      backgroundElement = {
        isBackground: true,
        id: 'baz',
        type: ElementType.Image,
        scale: 1,
        x: 50,
        y: 100,
        height: 1920,
        width: 1080,
        rotationAngle: 0,
        resource: {
          type: ResourceType.Image,
          mimeType: 'image/png',
          id: 123,
          src: 'https://example.com/image.png',
          poster: 'https://example.com/poster.png',
          height: 1920,
          width: 1080,
          alt: '',
          isExternal: false,
        } as Resource,
      };
    });

    it('should render a single layer with no background', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [backgroundElement],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              ...backgroundElement,
              overlay: { color: { r: 0, g: 255, b: 0, a: 0.4 } },
            },
          ],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
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
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          animations: [
            {
              id: '123',
              targets: ['123', '124'],
              type: AnimationType.Bounce,
              duration: 1000,
            },
            {
              id: '124',
              targets: ['123'],
              type: AnimationType.Spin,
              duration: 1000,
            },
          ] as StoryAnimation[],
          elements: [
            {
              id: '123',
              type: ElementType.Video,
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
              type: ElementType.Shape,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);

      const storyAnimations = container.querySelectorAll('amp-story-animation');
      expect(storyAnimations).toHaveLength(3);
      expect(storyAnimations[0]).toHaveAttribute('trigger', `visibility`);
    });
  });

  describe('page advancement', () => {
    it('should use default value for auto-advance-after', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      expect(queryByAutoAdvanceAfter(container, '7s')).not.toBeInTheDocument();
    });

    it('should use default duration for auto-advance-after', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
        },
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      expect(getByAutoAdvanceAfter(container, '7s')).toBeInTheDocument();
    });

    it('should use custom value for auto-advance-after', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          advancement: { autoAdvance: false },
          elements: [],
        },
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      expect(queryByAutoAdvanceAfter(container, '7s')).not.toBeInTheDocument();
    });

    it('should use custom duration for auto-advance-after', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          advancement: { autoAdvance: true, pageDuration: 9 },
          elements: [],
        },
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      expect(getByAutoAdvanceAfter(container, '9s')).toBeInTheDocument();
    });

    it('should use default duration for images', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'baz',
              type: ElementType.Image,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      expect(getByAutoAdvanceAfter(container, '7s')).toBeInTheDocument();
    });

    it('should use video element ID for auto-advance-after', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'baz',
              type: ElementType.Video,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const video = queryById(container, 'el-baz-media');
      expect(video).toBeInTheDocument();
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
      expect(
        getByAutoAdvanceAfter(container, 'el-baz-media')
      ).toBeInTheDocument();
    });

    it('should use video with volume', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'baz',
              type: ElementType.Video,
              mimeType: 'video/mp4',
              scale: 1,
              origRatio: 9 / 16,
              x: 50,
              y: 100,
              height: 1920,
              width: 1080,
              rotationAngle: 0,
              loop: false,
              volume: 0.5,
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

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const video = queryById(container, 'el-baz-media');
      expect(video).toBeInTheDocument();
      expect(video).toMatchInlineSnapshot(`
        <amp-video
          artwork="https://example.com/poster.png"
          autoplay="autoplay"
          id="el-baz-media"
          layout="fill"
          poster="https://example.com/poster.png"
          volume="0.5"
        >
          <source
            src="https://example.com/video.mp4"
            type="video/mp4"
          />
        </amp-video>
      `);
      expect(
        getByAutoAdvanceAfter(container, 'el-baz-media')
      ).toBeInTheDocument();
    });

    it('should use video element ID for auto-advance-after if video is below defaultPageDuration', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'baz',
              type: ElementType.Video,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const video = getById(container, 'el-baz-media');
      expect(video).toBeInTheDocument();
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
      expect(
        getByAutoAdvanceAfter(container, 'el-baz-media')
      ).toBeInTheDocument();
    });

    it('should ignore looping video for auto-advance-after and set default instead', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'baz',
              type: ElementType.Video,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      expect(getByAutoAdvanceAfter(container, '7s')).toBeInTheDocument();
    });
  });

  describe('pageAttachment', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: ElementType.Image,
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
      type: ElementType.Text,
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

    it('should output page attachment if the URL is set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Click me!',
            theme: 'dark',
            icon: 'https://example.test/example.jpg',
          } as PageAttachment,
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      expect(pageOutlink).toHaveTextContent('Click me!');
      expect(pageOutlink).toHaveAttribute(
        'cta-image',
        'https://example.test/example.jpg'
      );
      expect(pageOutlink).toHaveAttribute('theme', 'dark');
      expect(pageOutlink.firstChild).toHaveAttribute(
        'href',
        'https://example.test'
      );
      expect(pageOutlink).toBeInTheDocument();
    });

    it('should not output page attachment if the URL is empty', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
          pageAttachment: {
            url: '',
            ctaText: 'Click me!',
          },
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      expect(pageOutlink).not.toBeInTheDocument();
    });

    it('should not output cta-image if empty', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Click me!',
            theme: 'dark',
            icon: '',
          } as PageAttachment,
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      expect(pageOutlink).toHaveTextContent('Click me!');
      expect(pageOutlink).not.toHaveAttribute('cta-image');
      expect(pageOutlink).toBeInTheDocument();
    });

    it('should output rel', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
          pageAttachment: {
            url: 'https://example.test',
            ctaText: 'Click me!',
            theme: 'dark',
            icon: '',
            rel: ['nofollow'],
          } as PageAttachment,
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      expect(pageOutlink).toBeInTheDocument();
      expect(pageOutlink).toHaveTextContent('Click me!');
      expect(pageOutlink).not.toHaveAttribute('cta-image');

      const pageOutATag = pageOutlink.querySelector('a');
      expect(pageOutATag).toBeInTheDocument();
      expect(pageOutATag).toHaveAttribute('rel', 'nofollow');
    });

    it('should not output a link in page attachment area', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: 'https://shouldremove.com',
              },
            },
          ],
          pageAttachment: {
            url: 'https://example.com',
            ctaText: 'Click me!',
          },
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain('Hello, link');
      expect(content).not.toContain('https://shouldremove.com');
    });

    it('should output a link outside of page attachment area', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: 'https://shouldoutput.com',
              },
              y: 0,
              height: 100,
            },
          ],
          pageAttachment: {
            url: 'https://example.com',
            ctaText: 'Click me!',
          },
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain('Hello, link');
      expect(content).toContain('https://shouldoutput.com');
    });

    it('should output a link in page attachment area if page attachment is not set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...TEXT_ELEMENT,
              link: {
                url: 'https://shouldoutput.com',
              },
            },
          ],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain('Hello, link');
      expect(content).toContain('https://shouldoutput.com');
    });

    it('should print page attachment as the last child element', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          pageAttachment: {
            url: 'https://example.com',
            ctaText: 'Click me!',
          },
          animations: [],
          elements: [
            {
              id: 'baz',
              type: ElementType.Video,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const page = container.querySelector('amp-story-page');
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      expect(pageOutlink).toBeInTheDocument();
      expect(page.lastChild).toBe(pageOutlink);
    });
  });

  describe('background color', () => {
    const BACKGROUND_ELEMENT = {
      id: 'baz',
      type: ElementType.Image,
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          id: '123',
          elements: [BACKGROUND_ELEMENT],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
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
              type: ElementType.Shape,
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
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain('background-color:rgba(255,255,255,0.5)');
    });
  });

  describe('link', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: ElementType.Image,
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
      type: ElementType.Text,
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain('Hello, example!');
      expect(content).toContain('https://hello.example');
    });

    it('should not output element link if the url is empty', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).not.toContain('Hello, example!');
      expect(content).not.toContain('https://hello.example');
    });
  });

  describe('border', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: ElementType.Image,
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
    };

    it('should output element with border if border is set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...MEDIA_ELEMENT,
              border: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                color: { color: { r: 255, g: 255, b: 255 } },
              },
            },
          ],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain('border-width:10px 10px 10px 10px;');
      expect(content).toContain('border-color:rgba(255,255,255,1);');
    });

    it('should not output border if the element is not rectangular', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...MEDIA_ELEMENT,
              border: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                color: { color: { r: 255, g: 255, b: 255 } },
                position: 'center',
              },
              mask: {
                type: MaskTypes.CIRCLE,
              },
            },
          ],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).not.toContain('border-width:10px 10px 10px 10px;');
      expect(content).not.toContain('border-color:rgba(255,255,255,1);');
    });
  });

  describe('overlay', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: ElementType.Image,
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
    };

    it('should output image with linear overlay if set', () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            BACKGROUND_ELEMENT,
            {
              ...MEDIA_ELEMENT,
              type: ElementType.Video,
              overlay: {
                color: { r: 0, g: 0, b: 0, a: 0.5 },
              },
            },
          ],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain('background-color:rgba(0,0,0,0.5)');
    });
  });

  describe('borderRadius', () => {
    const BACKGROUND_ELEMENT = {
      isBackground: true,
      id: 'baz',
      type: ElementType.Image,
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
      type: ElementType.Image,
      borderRadius: {
        locked: false,
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [BACKGROUND_ELEMENT, MEDIA_ELEMENT],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
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
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
              length: 100,
              lengthFormatted: '1:40',
            },
            loop: true,
            tracks: [],
          },
          elements: [],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const content = renderToStaticMarkup(
        <PageOutput {...props} flags={{}} />
      );
      expect(content).toContain(
        'background-audio="https://example.com/audio.mp3"'
      );
      expect(content).not.toContain('amp-video');
    });

    it('should add background audio as amp-video', () => {
      const props = {
        id: '123',
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
          elements: [],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);

      const captions = container.querySelector('amp-story-captions');
      expect(captions).toBeInTheDocument();
      expect(captions).toMatchSnapshot();
      expect(captions).toHaveAttribute('id', 'el-123-captions');

      const video = container.querySelector('amp-video');
      expect(video).toBeInTheDocument();
      expect(video).toMatchSnapshot();
      expect(video).toHaveAttribute('captions-id', 'el-123-captions');

      const page = container.querySelector('amp-story-page');
      expect(page).toBeInTheDocument();
      expect(page).not.toContain(
        'background-audio="https://example.com/audio.mp3"'
      );
    });

    it('should not contain background audio if missing', () => {
      const props = {
        id: '123',
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const page = container.querySelector('amp-story-page');
      expect(page).toBeInTheDocument();
      expect(page).not.toContain('background-audio=');
    });

    it('should use amp-video for non-looping background audio', () => {
      const props = {
        id: '123',
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
          elements: [],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const video = container.querySelector('amp-video');
      expect(video).toBeInTheDocument();
      expect(video).toMatchSnapshot();

      const page = container.querySelector('amp-story-page');
      expect(page).toBeInTheDocument();
      expect(page).not.toContain(
        'background-audio="https://example.com/audio.mp3"'
      );
    });

    it('should use amp-video with crossorigin="anonymous" for background audio with tracks', () => {
      const props = {
        id: '123',
        page: {
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
            loop: false,
          },
          id: '123',
          elements: [],
        },
        defaultAutoAdvance: false,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const video = container.querySelector('amp-video');
      expect(video).toBeInTheDocument();
      expect(video).toMatchSnapshot();

      const page = container.querySelector('amp-story-page');
      expect(page).toBeInTheDocument();
      expect(page).not.toContain(
        'background-audio="https://example.com/audio.mp3"'
      );
    });
  });

  describe('video captions', () => {
    it('should render layer for amp-story-captions', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'baz',
              type: ElementType.Video,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const captions = container.querySelector('amp-story-captions');
      expect(captions).toBeInTheDocument();
      expect(captions).toMatchInlineSnapshot(`
      <amp-story-captions
        id="el-baz-captions"
        layout="container"
        style-preset="default"
      />
      `);
    });
  });

  describe('Shopping', () => {
    it('should render shopping attachment if there are products', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'el1',
              type: ElementType.Product,
              x: 50,
              y: 50,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_LAMP,
            },
            {
              id: 'el2',
              type: ElementType.Product,
              x: 100,
              y: 100,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_ART,
            },
          ],
        },
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const shoppingAttachment = container.querySelector(
        'amp-story-shopping-attachment'
      );
      expect(shoppingAttachment).toBeInTheDocument();
    });

    it('should render shopping attachment with custom cta text if there are products', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          shoppingAttachment: {
            ctaText: 'Buy now',
          },
          elements: [
            {
              id: 'el1',
              type: ElementType.Product,
              x: 50,
              y: 50,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_LAMP,
            },
            {
              id: 'el2',
              type: ElementType.Product,
              x: 100,
              y: 100,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_ART,
            },
          ],
        },
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const shoppingAttachment = container.querySelector(
        'amp-story-shopping-attachment'
      );

      expect(shoppingAttachment).toBeInTheDocument();
      expect(shoppingAttachment).toHaveAttribute('cta-text', 'Buy now');
      expect(shoppingAttachment).toHaveAttribute('theme', 'light');
    });

    it('should not render page attachment if there are products', () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'el1',
              type: ElementType.Product,
              x: 50,
              y: 50,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_LAMP,
            },
            {
              id: 'el2',
              type: ElementType.Product,
              x: 100,
              y: 100,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_ART,
            },
          ],
          pageAttachment: {
            url: 'https://example.com',
            ctaText: 'Click me!',
          },
        },
      };

      const { container } = render(<PageOutput {...props} flags={{}} />);
      const shoppingAttachment = container.querySelector(
        'amp-story-shopping-attachment'
      );
      expect(shoppingAttachment).toBeInTheDocument();
      const pageOutlink = container.querySelector('amp-story-page-outlink');
      expect(pageOutlink).not.toBeInTheDocument();
    });
  });

  describe('AMP validation', () => {
    jest.retryTimes(3, { logErrorsBeforeRetry: true });

    it('should produce valid AMP output', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
        },
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid AMP output with manual page advancement', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
        },
        defaultAutoAdvance: false,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid AMP output with custom page duration', async () => {
      const props = {
        id: 's1',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'p1',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          advancement: { autoAdvance: true, pageDuration: 10 },
          elements: [],
        },
        defaultAutoAdvance: true,
        defaultPageDuration: 7,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid AMP output with custom manual page advancement', async () => {
      const props = {
        id: 's1',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'p1',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          advancement: { autoAdvance: false },
          elements: [],
        },
        defaultAutoAdvance: true,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid AMP output with Page Attachment', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [],
        },
        defaultAutoAdvance: true,
        pageAttachment: {
          url: 'https://example.com',
          ctaText: 'Click me!',
        },
      };
      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid output with media elements', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: '123',
              type: ElementType.Video,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid output with animations', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          animations: [
            {
              id: '123',
              targets: ['123'],
              type: AnimationType.Bounce,
              duration: 1000,
            },
          ] as StoryAnimation[],
          elements: [
            {
              type: ElementType.Text,
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
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid output with background audio', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
              length: 100,
              lengthFormatted: '1:40',
            },
            tracks: [],
            loop: true,
          },
          animations: [],
          elements: [],
        },
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid output with background audio with captions', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
            loop: false,
          },
          animations: [],
          elements: [],
        },
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it('should produce valid output with non-looping background audio', async () => {
      const props = {
        id: '123',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: '123',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
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
        defaultAutoAdvance: true,
        defaultPageDuration: 11,
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });

    it.skip('should produce valid output with shopping products', async () => {
      const props = {
        id: 'foo',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        page: {
          id: 'bar',
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              id: 'el1',
              type: ElementType.Product,
              x: 50,
              y: 50,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_LAMP,
            },
            {
              id: 'el2',
              type: ElementType.Product,
              x: 100,
              y: 100,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_ART,
            },
            {
              id: 'el3',
              type: ElementType.Product,
              x: 150,
              y: 150,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_CHAIR,
            },
            {
              id: 'el3',
              type: ElementType.Product,
              x: 200,
              y: 200,
              width: 32,
              height: 32,
              rotationAngle: 0,
              product: PRODUCT_FLOWERS,
            },
          ],
        },
      };

      await expect(
        <PageOutput {...props} flags={{}} />
      ).toBeValidAMPStoryPage();
    });
  });
});

/* eslint-enable testing-library/no-node-access, testing-library/no-container */
