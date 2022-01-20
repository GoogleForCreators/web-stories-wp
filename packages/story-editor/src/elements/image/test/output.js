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
import ImageOutput from '../output';

describe('Image output', () => {
  const baseProps = {
    element: {
      id: '123',
      type: 'image',
      mimeType: 'image/png',
      scale: 200,
      origRatio: 16 / 9,
      x: 50,
      y: 100,
      height: 231.75,
      width: 206,
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
            sourceUrl: 'https://example.com/image-mid.png',
            width: 960,
            height: 540,
            mimeType: 'image/png',
          },
          full: {
            sourceUrl: 'https://example.com/image.png',
            width: 1920,
            height: 1080,
            mimeType: 'image/png',
          },
        },
      },
    },
    box: { width: 1920, height: 1080, x: 50, y: 100, rotationAngle: 0 },
  };

  it('should produce valid AMP output', async () => {
    await expect(<ImageOutput {...baseProps} />).toBeValidAMPStoryElement();
  });

  it('should produce an AMP img with a srcset/sizes', async () => {
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
    // `sizes` should match: (min-width: <desktop_screen_width>) <desktop_image_width>, <mobile_image_width>
    // The image size is 206px wide, which is half page width.
    // 45vh is the page width of stories in desktop mode (divided by 2, rounded up is 23).
    await expect(outputStr).toStrictEqual(
      expect.stringMatching(/sizes="\(min-width: 1024px\) 23vh, 50vw"/)
    );
    // The "disable-inline-width" attribute should accompany the "sizes" attribute.
    await expect(outputStr).toStrictEqual(
      expect.stringMatching('disable-inline-width="true"')
    );
  });

  it('should generate correct `sizes` for a narrower background image', async () => {
    const props = {
      ...baseProps,
      element: {
        ...baseProps.element,
        width: 206, // 50%
        height: 732, // 100%
        isBackground: true,
        scale: 300,
      },
    };
    const output = <ImageOutput {...props} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(output).toBeValidAMPStoryElement();
    // `sizes` should match: (min-width: <desktop_screen_width>) <desktop_image_width>, <mobile_image_width>
    // The background image should scale up its width to fit the page.
    // 45vh is the page width of stories in desktop mode.
    // The image zoom is 300 (3x) so triple both measurements.
    await expect(outputStr).toStrictEqual(
      expect.stringMatching(/sizes="\(min-width: 1024px\) 135vh, 300vw"/)
    );
    // The "disable-inline-width" attribute should accompany the "sizes" attribute.
    await expect(outputStr).toStrictEqual(
      expect.stringMatching('disable-inline-width="true"')
    );
  });

  it('should generate correct `sizes` for a wider background image', async () => {
    const props = {
      ...baseProps,
      element: {
        ...baseProps.element,
        width: 412, // 100%
        height: 183, // 25%
        isBackground: true,
        scale: 100,
      },
    };
    const output = <ImageOutput {...props} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(output).toBeValidAMPStoryElement();
    // `sizes` should match: (min-width: <desktop_screen_width>) <desktop_image_width>, <mobile_image_width>
    // The background image should scale up its width 4x since its height is 25%.
    // 45vh is the page width of stories in desktop mode.
    await expect(outputStr).toStrictEqual(
      expect.stringMatching(/sizes="\(min-width: 1024px\) 180vh, 400vw"/)
    );
    // The "disable-inline-width" attribute should accompany the "sizes" attribute.
    await expect(outputStr).toStrictEqual(
      expect.stringMatching('disable-inline-width="true"')
    );
  });

  it('should produce an AMP img with no srcset/sizes if the resource has no `sizes`', async () => {
    const basePropsNoSrcset = { ...baseProps };
    basePropsNoSrcset.element.resource.sizes = {};
    const output = <ImageOutput {...basePropsNoSrcset} />;
    const outputStr = renderToStaticMarkup(output);
    await expect(output).toBeValidAMPStoryElement();
    await expect(outputStr).toStrictEqual(expect.not.stringMatching('srcSet='));
    await expect(outputStr).toStrictEqual(expect.not.stringMatching('sizes='));
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

  it('should remove blob URLs', async () => {
    const props = {
      ...baseProps,
      element: {
        ...baseProps.element,
        resource: {
          ...baseProps.element.resource,
          src: 'blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a',
        },
      },
    };
    const output = <ImageOutput {...props} />;
    await expect(output).not.toBeValidAMPStoryElement();
    const outputStr = renderToStaticMarkup(output);
    await expect(outputStr).not.toStrictEqual(expect.stringMatching('blob:'));
  });
});
