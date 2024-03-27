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
/**
 * External dependencies
 */
import { ElementType } from '@googleforcreators/elements';
import type {
  BackgroundAudio,
  Page,
  ProductElement,
  VideoElement,
} from '@googleforcreators/elements';
import getUsedAmpExtensions from '../getUsedAmpExtensions';

describe('getUsedAmpExtensions', () => {
  it('should always include the AMP runtime script', () => {
    const actual = getUsedAmpExtensions([]);

    expect(actual).toHaveLength(2);
    expect(actual).toStrictEqual(
      expect.arrayContaining([{ src: 'https://cdn.ampproject.org/v0.js' }])
    );
  });

  it('should always include the AMP Stories script', () => {
    const actual = getUsedAmpExtensions([]);

    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-story',
          src: 'https://cdn.ampproject.org/v0/amp-story-1.0.js',
        },
      ])
    );
  });

  it('should include the amp-video script if there is a video', () => {
    const pages: Page[] = [
      {
        elements: [{ type: ElementType.Video }],
      } as Page,
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(3);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-video',
          src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
        },
      ])
    );
  });

  it('should include the amp-video script if there is a gif element', () => {
    const pages: Page[] = [
      {
        elements: [{ type: ElementType.Gif }],
      } as Page,
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(3);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-video',
          src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
        },
      ])
    );
  });

  it('should include the amp-video script only once if there are multiple videos', () => {
    const pages: Page[] = [
      {
        elements: [{ type: ElementType.Video }],
      } as Page,
      {
        elements: [{ type: ElementType.Text }],
      } as Page,
      {
        elements: [{ type: ElementType.Video }],
      } as Page,
      {
        elements: [{ type: ElementType.Video }],
      } as Page,
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(3);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-video',
          src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
        },
      ])
    );
  });

  it('should include the amp-story-captions script if there is a video with tracks', () => {
    const pages: Page[] = [
      {
        id: 'abc',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'a',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotationAngle: 0,
            type: ElementType.Video,
            resource: {
              type: 'video',
              mimeType: 'video/mp4',
              id: 123,
              src: 'https://example.com/video.mp4',
              alt: '',
              width: 100,
              height: 100,
              isExternal: false,
            },
            tracks: [
              {
                track: 'https://example.com/track.vtt',
                trackId: 123,
                trackName: 'track.vtt',
                id: 'rersd-fdfd-fdfd-fdfd',
                srclang: '',
                label: '',
                kind: 'captions',
              },
            ],
          } as VideoElement,
        ],
      } as Page,
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(4);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-story-captions',
          src: 'https://cdn.ampproject.org/v0/amp-story-captions-0.1.js',
        },
      ])
    );
  });

  it('should include the amp-story-captions script if there is a background audio with tracks', () => {
    const pages: Page[] = [
      {
        id: 'abc',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        backgroundAudio: {
          resource: { src: 'https://example.com/audio.mp3' },
          tracks: [
            {
              track: 'https://example.com/track.vtt',
              trackId: 123,
              trackName: 'track.vtt',
              id: 'rersd-fdfd-fdfd-fdfd',
              srclang: '',
              label: '',
              kind: 'captions',
            },
          ],
        } as BackgroundAudio,
        elements: [],
      },
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(4);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-video',
          src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
        },
        {
          name: 'amp-story-captions',
          src: 'https://cdn.ampproject.org/v0/amp-story-captions-0.1.js',
        },
      ])
    );
  });

  it('should include the amp-story-shopping script if there are products', () => {
    const pages: Page[] = [
      {
        id: 'abc',
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
            product: {},
          } as ProductElement,
        ],
      },
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(3);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-story-shopping',
          src: 'https://cdn.ampproject.org/v0/amp-story-shopping-0.1.js',
        },
      ])
    );
  });
});
