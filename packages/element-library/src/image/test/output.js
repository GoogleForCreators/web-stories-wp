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
import ImageOutput from '../output';

describe('Image output', () => {
  const baseProps = {
    element: {
      id: '123',
      type: 'image',
      mimeType: 'image/png',
      scale: 1,
      origRatio: 16 / 9,
      x: 50,
      y: 100,
      height: 1080,
      width: 1920,
      rotationAngle: 0,
      resource: {
        id: 123,
        type: 'image',
        mimeType: 'image/png',
        src: 'https://example.com/image.png',
        alt: 'alt text',
        height: 1080,
        width: 1920,
        sizes: {
          mid: {
            source_url: 'https://example.com/image-mid.png',
            width: 960,
            height: 540,
          },
          full: {
            source_url: 'https://example.com/image.png',
            width: 1920,
            height: 1080,
          },
        },
      },
    },
    box: { width: 1920, height: 1080, x: 50, y: 100, rotationAngle: 0 },
  };

  it('should produce valid AMP output', async () => {
    await expect(<ImageOutput {...baseProps} />).toBeValidAMPStoryElement();
  });

  it('should produce an AMP img with a srcset', async () => {
    const output = <ImageOutput {...baseProps} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(output).toBeValidAMPStoryElement();
    await expect(outputStr).toStrictEqual(
      expect.stringMatching(
        'srcSet="https://example.com/image.png 1920w,' +
          'https://example.com/image-mid.png 960w"'
      )
    );
    await expect(outputStr).toStrictEqual(
      expect.stringMatching('src="https://example.com/image.png"')
    );
  });

  it('should produce an AMP img with no srcset if the resource has no `sizes`', async () => {
    const basePropsNoSrcset = { ...baseProps };
    basePropsNoSrcset.element.resource.sizes = {};
    const output = <ImageOutput {...basePropsNoSrcset} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(output).toBeValidAMPStoryElement();
    await expect(outputStr).toStrictEqual(expect.not.stringMatching('srcSet='));
    await expect(outputStr).toStrictEqual(
      expect.stringMatching('src="https://example.com/image.png"')
    );
  });

  it('an undefined alt tag in the element should fall back to the resource', async () => {
    const props = {
      ...baseProps,
      element: { ...baseProps.element, alt: undefined },
    };
    const output = <ImageOutput {...props} />;
    await expect(output).toBeValidAMPStoryElement();
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).toStrictEqual(expect.stringMatching('alt text'));
  });

  it('an empty string alt tag in the element should not fall back to the resource', async () => {
    const props = { ...baseProps, element: { ...baseProps.element, alt: '' } };
    const output = <ImageOutput {...props} />;
    await expect(output).toBeValidAMPStoryElement();
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).not.toStrictEqual(
      expect.stringMatching('alt text')
    );
  });
});
