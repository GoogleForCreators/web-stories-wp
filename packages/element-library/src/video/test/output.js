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

/**
 * Internal dependencies
 */
import VideoOutput from '../output';

describe('Video output', () => {
  const baseProps = {
    element: {
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
      tracks: [],
      resource: {
        type: 'video',
        mimeType: 'video/mp4',
        id: 123,
        src: 'https://example.com/image.png',
        poster: 'https://example.com/poster.png',
        alt: 'alt text',
        height: 1920,
        width: 1080,
      },
    },
    box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
  };

  it('an undefined alt tag in the element should fall back to the resource', async () => {
    const props = {
      ...baseProps,
      element: { ...baseProps.element, alt: undefined },
    };
    const output = <VideoOutput {...props} />;
    await expect(output).toBeValidAMPStoryElement();
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).toStrictEqual(expect.stringMatching('alt text'));
  });

  it('should not render noaudio attribute if isMuted is not set', async () => {
    const output = <VideoOutput {...baseProps} />;
    await expect(output).toBeValidAMPStoryElement();
    await expect(output).not.toStrictEqual(expect.stringMatching('noaudio'));
  });

  it('should render noaudio attribute if isMuted is true', async () => {
    const props = {
      ...baseProps,
      element: {
        ...baseProps.element,
        resource: { ...baseProps.element.resource, isMuted: true },
      },
    };

    const output = <VideoOutput {...props} />;
    await expect(output).toBeValidAMPStoryElement();
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).toStrictEqual(expect.stringMatching('noaudio'));
  });

  it('an empty string alt tag in the element should not fall back to the resource', async () => {
    const props = { ...baseProps, element: { ...baseProps.element, alt: '' } };
    const output = <VideoOutput {...props} />;
    await expect(output).toBeValidAMPStoryElement();
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).not.toStrictEqual(
      expect.stringMatching('alt text')
    );
  });

  it('should remove blob URLs', async () => {
    const props = {
      ...baseProps,
      element: {
        ...baseProps.element,
        resource: {
          ...baseProps.element.resource,
          src: 'blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
          poster:
            'blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
        },
      },
    };
    const output = <VideoOutput {...props} />;
    await expect(output).not.toBeValidAMPStoryElement();
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).not.toStrictEqual(expect.stringMatching('blob:'));
  });

  it('should add captions-id attribute if there are tracks', async () => {
    const props = {
      ...baseProps,
      element: {
        ...baseProps.element,
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
    };

    const output = <VideoOutput {...props} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).toStrictEqual(
      expect.stringMatching('captions-id="el-123-captions"')
    );
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output', async () => {
      await expect(<VideoOutput {...baseProps} />).toBeValidAMPStoryElement();
    });

    // eslint-disable-next-line jest/no-disabled-tests -- amp-story-captions is not stable yet.
    it.skip('should produce valid AMP output with track', async () => {
      const props = {
        ...baseProps,
        element: {
          ...baseProps.element,
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
      };
      await expect(<VideoOutput {...props} />).toBeValidAMPStoryElement();
    });
  });
});
