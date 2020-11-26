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
import { useFeature, FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import getStoryMarkup from '../getStoryMarkup';

describe('getStoryMarkup', () => {
  useFeature.mockImplementation(() => true);
  FlagsProvider.mockImplementation(({ children }) => children);

  it('should generate expected story markup', () => {
    const story = {
      storyId: 1,
      title: 'Story!',
      author: { id: 1, name: 'John Doe' },
      slug: 'story',
      link: 'https://example.com',
      publisherLogoUrl: 'https://example.com',
      defaultPageDuration: 7,
      status: 'publish',
      date: '2020-04-10T07:06:26',
      modified: '',
      excerpt: '',
      featuredMedia: { id: 0 },
      password: '',
    };
    const meta = {
      publisher: {
        name: 'AMP',
        logo: 'https://example.com/fallback-wordpress-publisher-logo.png',
      },
    };
    const pages = [
      {
        type: 'page',
        id: '2',
        animations: [
          { targets: ['2'], type: 'bounce', duration: 1000 },
          { targets: ['2'], type: 'spin', duration: 1000 },
        ],
        elements: [
          {
            id: '2',
            type: 'text',
            x: 0,
            y: 0,
            width: 211,
            height: 221,
            rotationAngle: 1,
            content: 'Hello World',
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
            padding: {
              vertical: 0,
              horizontal: 0,
            },
          },
        ],
      },
    ];
    const markup = getStoryMarkup(story, pages, meta, {});
    expect(markup).toContain('Hello World');
    expect(markup).toContain('transform:rotate(1deg)');
    expect(markup).toContain(
      '</amp-story-grid-layer></amp-story-page></amp-story></body></html>'
    );
    expect(markup).not.toContain('poster-portrait-src=');

    expect(markup).toContain('<amp-story-animation');
  });
});
