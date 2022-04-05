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
import { renderToStaticMarkup } from '@googleforcreators/react';
import { setUpEditorStore } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryOutput from '../story';

describe('Story output', () => {
  beforeAll(() => {
    useFeature.mockImplementation((feature) => {
      const config = {
        enableAnimation: true,
      };

      return config[feature];
    });

    setUpEditorStore();
  });

  it('should include Google Fonts stylesheet', () => {
    const props = {
      id: '123',
      backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
      story: {
        title: 'Example',
        slug: 'example',
        status: 'publish',
        author: { id: 1, name: 'John Doe' },
        date: '123',
        modified: '123',
        excerpt: '123',
        featuredMedia: {
          id: 123,
          url: 'https://example.com/poster.png',
          width: 640,
          height: 853,
        },
        publisherLogo: {
          id: 1,
          url: 'https://example.com/logo.png',
          height: 0,
          width: 0,
        },
        password: '123',
        link: 'https://example.com/story',
        autoAdvance: false,
      },
      pages: [
        {
          id: '123',
          animations: [
            { id: 'anim1', targets: ['123'], type: 'bounce', duration: 1000 },
            { id: 'anim1', targets: ['124'], type: 'spin', duration: 500 },
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
              content: '<span style="font-style: italic">Hello World</span>',
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
            },
            {
              type: 'text',
              id: '124',
              x: 50,
              y: 100,
              height: 1920,
              width: 1080,
              rotationAngle: 0,
              content: '<span style="font-weight: 400">Hello World</span>',
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
            },
          ],
        },
      ],
      metadata: {
        publisher: 'Publisher Name',
      },
    };

    const content = renderToStaticMarkup(<StoryOutput {...props} />);

    expect(content).toContain(
      '<link href="https://fonts.googleapis.com/css2?display=swap&amp;family=Roboto%3Aital%401&amp;family=Lato" rel="stylesheet"/>'
    );
  });

  it('should add background audio', () => {
    const props = {
      id: '123',
      backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
      story: {
        title: 'Example',
        slug: 'example',
        status: 'publish',
        author: { id: 1, name: 'John Doe' },
        date: '123',
        modified: '123',
        excerpt: '123',
        featuredMedia: {
          id: 123,
          url: 'https://example.com/poster.png',
          width: 640,
          height: 853,
        },
        publisherLogo: {
          id: 1,
          url: 'https://example.com/logo.png',
          height: 0,
          width: 0,
        },
        password: '123',
        link: 'https://example.com/story',
        autoAdvance: false,
        backgroundAudio: {
          resource: {
            src: 'https://example.com/audio.mp3',
            id: 123,
            mimeType: 'audio/mpeg',
          },
        },
      },
      pages: [
        {
          id: '123',
          animations: [
            { id: 'anim1', targets: ['123'], type: 'bounce', duration: 1000 },
            { id: 'anim1', targets: ['124'], type: 'spin', duration: 500 },
          ],
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
        publisher: 'Publisher Name',
      },
    };

    const content = renderToStaticMarkup(<StoryOutput {...props} />);

    expect(content).toContain(
      'background-audio="https://example.com/audio.mp3"'
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
          author: { id: 1, name: 'John Doe' },
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: {
            id: 123,
            url: 'https://example.com/poster.png',
            width: 640,
            height: 853,
          },
          publisherLogo: {
            id: 1,
            url: 'https://example.com/logo.png',
            height: 0,
            width: 0,
          },
          password: '123',
          link: 'https://example.com/story',
          autoAdvance: false,
        },
        pages: [],
        metadata: {
          publisher: 'Publisher Name',
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
          author: { id: 1, name: 'John Doe' },
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: {
            id: 123,
            url: 'https://example.com/poster.png',
            width: 640,
            height: 853,
          },
          publisherLogo: {
            id: 1,
            url: 'https://example.com/logo.png',
            height: 0,
            width: 0,
          },
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
          publisher: 'Publisher Name',
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
          author: { id: 1, name: 'John Doe' },
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: {
            id: 123,
            url: 'https://example.com/poster.png',
            width: 640,
            height: 853,
          },
          publisherLogo: {
            id: 1,
            url: 'https://example.com/logo.png',
            height: 0,
            width: 0,
          },
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
          publisher: 'Publisher Name',
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
          author: { id: 1, name: 'John Doe' },
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: {
            id: 123,
            url: 'https://example.com/poster.png',
            width: 640,
            height: 853,
          },
          publisherLogo: {
            id: 1,
            url: 'https://example.com/logo.png',
            height: 0,
            width: 0,
          },
          password: '123',
          link: 'https://example.com/story',
          autoAdvance: false,
        },
        pages: [
          {
            id: '123',
            animations: [
              { id: 'anim1', targets: ['123'], type: 'bounce', duration: 1000 },
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
                },
              },
            ],
          },
        ],
        metadata: {
          publisher: 'Publisher Name',
        },
      };

      await expect(<StoryOutput {...props} />).toBeValidAMP();
    });

    it('should produce valid AMP output when using background audio', async () => {
      const props = {
        id: '123',
        backgroundColor: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
        story: {
          title: 'Example',
          slug: 'example',
          status: 'publish',
          author: { id: 1, name: 'John Doe' },
          date: '123',
          modified: '123',
          excerpt: '123',
          featuredMedia: {
            id: 123,
            url: 'https://example.com/poster.png',
            width: 640,
            height: 853,
          },
          publisherLogo: {
            id: 1,
            url: 'https://example.com/logo.png',
            height: 0,
            width: 0,
          },
          password: '123',
          link: 'https://example.com/story',
          autoAdvance: false,
          backgroundAudio: {
            resource: {
              src: 'https://example.com/audio.mp3',
              id: 123,
              mimeType: 'audio/mpeg',
            },
          },
        },
        pages: [
          {
            id: '123',
            animations: [
              { id: 'anim1', targets: ['123'], type: 'bounce', duration: 1000 },
            ],
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
          publisher: 'Publisher Name',
        },
      };

      await expect(<StoryOutput {...props} />).toBeValidAMP();
    });
  });
});
