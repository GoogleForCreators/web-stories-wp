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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import GifOutput from '../output';

describe('Gif Output', () => {
  const baseProps = {
    element: {
      id: '048426c8-69ae-4e04-80f1-8f3fd4434261',
      type: 'gif',
      opacity: 100,
      x: 65,
      y: 196,
      width: 281,
      height: 223,
      scale: 100,
      rotationAngle: 0,
      resource: {
        type: 'gif',
        mimeType: 'image/gif',
        creationDate: '2016-02-04T18:16:22Z',
        src: 'https://c.tenor.com/4F2m7BWP6KYAAAAC/flying-kiss-muah.gif',
        width: 281,
        height: 223,
        alt: '',
        local: false,
        attribution: {
          author: [],
          registerUsageUrl:
            'https://media3p.googleapis.com/v1/media:registerUsage?token=AX7RMSdePGQBB3c/QAOBJ20QC%2BZNp2A549gSosisUYOjIC71nkvySPH5yj%2BqDBOVBmmFZ89azzUAN9x2GjkNbq3OXauUMho%3D',
        },
        output: {
          mimeType: 'video/mp4',
          src: 'https://c.tenor.com/4F2m7BWP6KYAAAPo/flying-kiss-muah.mp4',
        },
      },
    },
    box: {
      x: 15.7767,
      y: 31.71521,
      width: 68.20388,
      height: 36.08414,
      rotationAngle: 0,
    },
  };

  it('should produce an AMP video with autoplay, no controls, no audio, and loop', async () => {
    const output = <GifOutput {...baseProps} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).toStrictEqual(
      expect.stringMatching(
        'src="https://c.tenor.com/4F2m7BWP6KYAAAPo/flying-kiss-muah.mp4"'
      )
    );
    await expect(outputStr).toMatchSnapshot();
  });

  it('should include poster image if available', async () => {
    const newProps = { ...baseProps };
    newProps.element.resource.output.poster =
      'https://c.tenor.com/4F2m7BWP6KYAAAAC/flying-kiss-muah-poster.png';
    const output = <GifOutput {...newProps} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).toStrictEqual(
      expect.stringMatching(
        'src="https://c.tenor.com/4F2m7BWP6KYAAAPo/flying-kiss-muah.mp4"'
      )
    );
    await expect(outputStr).toMatchSnapshot();
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output', async () => {
      await expect(<GifOutput {...baseProps} />).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output with poster', async () => {
      const newProps = { ...baseProps };
      newProps.element.resource.output.poster =
        'https://c.tenor.com/4F2m7BWP6KYAAAAC/flying-kiss-muah-poster.png';
      await expect(<GifOutput {...newProps} />).toBeValidAMPStoryElement();
    });
  });
});
