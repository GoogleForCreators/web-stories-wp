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
      origRatio: 9 / 16,
      x: 50,
      y: 100,
      height: 1920,
      width: 1080,
      rotationAngle: 0,
      resource: {
        id: 123,
        type: 'image',
        mimeType: 'image/png',
        src: 'https://example.com/image.png',
        alt: 'alt text',
        height: 1920,
        width: 1080,
      },
    },
    box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
  };

  it('should produce valid AMP output', async () => {
    await expect(<ImageOutput {...baseProps} />).toBeValidAMPStoryElement();
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
