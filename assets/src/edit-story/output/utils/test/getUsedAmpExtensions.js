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
    const pages = [
      {
        elements: [{ type: 'video' }],
      },
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
    const pages = [
      {
        elements: [{ type: 'video' }],
      },
      {
        elements: [{ type: 'text' }],
      },
      {
        elements: [{ type: 'video' }],
      },
      {
        elements: [{ type: 'video' }],
      },
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
});
