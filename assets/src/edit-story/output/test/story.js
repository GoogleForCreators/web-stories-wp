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
import StoryOutput from '../story';

describe('Story output', () => {
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

  describe('AMP validation', () => {
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

    // Disable reason: https://github.com/ampproject/amphtml/issues/27881
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should produce valid AMP output when using Google fonts', async () => {
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
  });
});
