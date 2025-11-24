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
import {
  ElementType,
  registerElementType,
  type Page,
  type TextElement,
  FontService,
} from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { AnimationType } from '@googleforcreators/animation';
import getStoryMarkup from '../getStoryMarkup';

jest.mock('flagged');

describe('getStoryMarkup', () => {
  beforeAll(() => {
    // @ts-expect-error TODO: Fix types.
    elementTypes.forEach(registerElementType);
  });

  it('should generate expected story markup', () => {
    const story = {
      storyId: 1,
      title: 'Story!',
      author: { id: 1, name: 'John Doe' },
      slug: 'story',
      link: 'https://example.com',
      publisherLogo: {
        id: 1234,
        height: 96,
        width: 96,
        url: 'https://example.com',
      },
      defaultPageDuration: 7,
      status: 'publish',
      date: '2020-04-10T07:06:26',
      modified: '',
      excerpt: '',
      featuredMedia: {
        id: 0,
        url: 'https://example.com/poster.png',
        width: 640,
        height: 853,
      },
      fonts: {},
      password: '',
    };
    const metadata = {
      publisher: 'AMP',
    };
    const pages: Page[] = [
      {
        id: '2',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        animations: [
          {
            id: '1',
            targets: ['2'],
            type: AnimationType.Bounce,
            duration: 1000,
          },
          { id: '2', targets: ['2'], type: AnimationType.Spin, duration: 1000 },
        ],
        elements: [
          {
            id: '2',
            type: ElementType.Text,
            x: 0,
            y: 0,
            width: 211,
            height: 221,
            rotationAngle: 1,
            content: 'Hello World',
            font: {
              family: 'Roboto',
              service: FontService.GoogleFonts,
              fallbacks: ['Arial', 'sans-serif'],
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
              locked: false,
              vertical: 0,
              horizontal: 0,
            },
            marginOffset: 0,
            fontSize: 10,
            lineHeight: 1,
            textAlign: 'center',
            backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          } as TextElement,
        ],
      },
      {
        id: '2',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        animations: [
          {
            id: '1',
            targets: ['2'],
            type: AnimationType.Bounce,
            duration: 1000,
          },
          { id: '2', targets: ['2'], type: AnimationType.Spin, duration: 1000 },
        ],
        elements: [
          {
            id: '2',
            type: ElementType.Text,
            x: 0,
            y: 0,
            width: 211,
            height: 221,
            rotationAngle: 1,
            content: 'Hello World',
            font: {
              family: 'Roboto',
              service: FontService.GoogleFonts,
              fallbacks: ['Arial', 'sans-serif'],
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
              locked: false,
              vertical: 0,
              horizontal: 0,
            },
            marginOffset: 0,
            fontSize: 10,
            lineHeight: 1,
            textAlign: 'center',
            backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          } as TextElement,
        ],
      },
    ];
    const markup = getStoryMarkup(story, pages, metadata);
    expect(markup).toContain('Hello World');
    expect(markup).toContain('transform:rotate(1deg)');
    expect(markup).toContain(
      '</amp-story-grid-layer></amp-story-page></amp-story></body></html>'
    );
    expect(markup).toContain(
      'poster-portrait-src="https://example.com/poster.png"'
    );

    expect(markup).toContain('<amp-story-animation');
  });
});
