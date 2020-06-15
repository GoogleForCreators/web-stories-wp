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
jest.mock('flagged');
import { useFeature } from 'flagged';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import StoryOutput from '../story';

describe('Story output', () => {
  useFeature.mockImplementation((feature) => {
    const config = {
      enableAnimation: true,
    };

    return config[feature];
  });

  it('should include Google Fonts stylesheet', () => {
    const props = {
      id: '123',
      backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
      story: {
        title: 'Example',
        slug: 'example',
        status: 'publish',
        author: 123,
        date: '123',
        modified: '123',
        excerpt: '123',
        featuredMedia: 123,
        publisherLogoUrl: 'https://example.com/logo.png',
        password: '123',
        link: 'https://example.com/story',
        autoAdvance: false,
      },
      pages: [
        {
          id: '123',
          animations: [
            { targets: ['123'], type: 'bounce', duration: 1000 },
            { targets: ['124'], type: 'spin', duration: 500 },
          ],
          backgroundColor: {
            type: 'solid',
            color: { r: 255, g: 255, b: 255 },
          },
          page: {
            id: '123',
          },
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
                variants: [
                  [0, 400],
                  [1, 400],
                ],
              },
              fontStyle: 'italic',
            },
            {
              type: 'text',
              id: '124',
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
                family: 'Lato',
                service: 'fonts.google.com',
                variants: [
                  [0, 400],
                  [1, 400],
                ],
              },
              fontWeight: 400,
            },
          ],
        },
      ],
      metadata: {
        publisher: {
          name: 'Publisher Name',
          logo: 'https://example.com/logo.png',
        },
        fallbackPoster: 'https://example.com/logo.png',
        logoPlaceholder: 'https://example.com/logo.png',
      },
    };

    const content = renderToStaticMarkup(<StoryOutput {...props} />);

    expect(content).toContain(
      '<link href="https://fonts.googleapis.com/css2?display=swap&amp;family=Roboto%3Aital%401&amp;family=Lato" rel="stylesheet"/>'
    );
  });

  describe('AMP validation', () => {
    it('requires at least one page', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        story: {
          title: 'Example',
          slug: 'example',
          status: 'publish',
          author: 123,
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: 123,
          publisherLogoUrl: 'https://example.com/logo.png',
          password: '123',
          link: 'https://example.com/story',
          autoAdvance: false,
        },
        pages: [],
        metadata: {
          publisher: {
            name: 'Publisher Name',
            logo: 'https://example.com/logo.png',
          },
          fallbackPoster: 'https://example.com/logo.png',
          logoPlaceholder: 'https://example.com/logo.png',
        },
      };

      await expect(<StoryOutput {...props} />).not.toBeValidAMP();
    });

    it('should produce valid AMP output', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        story: {
          title: 'Example',
          slug: 'example',
          status: 'publish',
          author: 123,
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: 123,
          publisherLogoUrl: 'https://example.com/logo.png',
          password: '123',
          link: 'https://example.com/story',
          autoAdvance: false,
        },
        pages: [
          {
            id: '123',
            backgroundColor: {
              type: 'solid',
              color: { r: 255, g: 255, b: 255 },
            },
            page: {
              id: '123',
            },
            elements: [],
          },
        ],
        metadata: {
          publisher: {
            name: 'Publisher Name',
            logo: 'https://example.com/logo.png',
          },
          fallbackPoster: 'https://example.com/logo.png',
          logoPlaceholder: 'https://example.com/logo.png',
        },
      };

      await expect(<StoryOutput {...props} />).toBeValidAMP();
    });

    it('should produce valid AMP output when using Google fonts', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        story: {
          title: 'Example',
          slug: 'example',
          status: 'publish',
          author: 123,
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: 123,
          publisherLogoUrl: 'https://example.com/logo.png',
          password: '123',
          link: 'https://example.com/story',
          autoAdvance: false,
        },
        pages: [
          {
            id: '123',
            backgroundColor: {
              type: 'solid',
              color: { r: 255, g: 255, b: 255 },
            },
            page: {
              id: '123',
            },
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
        ],
        metadata: {
          publisher: {
            name: 'Publisher Name',
            logo: 'https://example.com/logo.png',
          },
          fallbackPoster: 'https://example.com/logo.png',
          logoPlaceholder: 'https://example.com/logo.png',
        },
      };

      await expect(<StoryOutput {...props} />).toBeValidAMP();
    });

    it('should produce valid AMP output when using animations', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        story: {
          title: 'Example',
          slug: 'example',
          status: 'publish',
          author: 123,
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: 123,
          publisherLogoUrl: 'https://example.com/logo.png',
          password: '123',
          link: 'https://example.com/story',
          autoAdvance: false,
        },
        pages: [
          {
            id: '123',
            animations: [{ targets: ['123'], type: 'bounce', duration: 1000 }],
            backgroundColor: {
              type: 'solid',
              color: { r: 255, g: 255, b: 255 },
            },
            page: {
              id: '123',
            },
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
        ],
        metadata: {
          publisher: {
            name: 'Publisher Name',
            logo: 'https://example.com/logo.png',
          },
          fallbackPoster: 'https://example.com/logo.png',
          logoPlaceholder: 'https://example.com/logo.png',
        },
      };

      await expect(<StoryOutput {...props} />).toBeValidAMP();
    });
  });
});
