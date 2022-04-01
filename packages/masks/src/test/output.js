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
import { registerElementTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import WithMask from '../output';
import { MaskTypes } from '../constants';

const elementTypes = [{ type: 'text', name: 'Text' }];

describe('WithMask', () => {
  beforeAll(() => {
    registerElementTypes(elementTypes);
  });

  it('should produce valid AMP output when no mask is set', async () => {
    const props = {
      element: {
        id: '123',
        type: 'text',
        x: 50,
        y: 100,
        height: 1920,
        width: 1080,
        rotationAngle: 0,
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    await expect(
      <WithMask {...props}>
        <p>{'Hello World'}</p>
      </WithMask>
    ).toBeValidAMPStoryElement();
  });

  it('should not add mask for background element', async () => {
    const props = {
      element: {
        id: '123',
        isBackground: true,
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
          type: 'image',
          mimeType: 'image/png',
          src: 'https://example.com/image.png',
          height: 1920,
          width: 1080,
        },
        mask: {
          type: MaskTypes.HEART,
          fill: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
          style: {},
        },
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    const content = renderToStaticMarkup(
      <WithMask {...props}>
        <p>{'Hello World'}</p>
      </WithMask>
    );

    await expect(content).not.toContain(MaskTypes.HEART);
  });

  it('should add mask for shaped image element', async () => {
    const props = {
      element: {
        id: '123',
        isBackground: false,
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
          type: 'image',
          mimeType: 'image/png',
          src: 'https://example.com/image.png',
          height: 1920,
          width: 1080,
        },
        mask: {
          type: MaskTypes.HEART,
          fill: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
          style: {},
        },
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    const content = renderToStaticMarkup(
      <WithMask {...props}>
        <p>{'Hello World'}</p>
      </WithMask>
    );

    await expect(content).toContain(MaskTypes.HEART);
  });

  it('should add default mask', async () => {
    const props = {
      element: {
        id: '123',
        isBackground: false,
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
          type: 'image',
          mimeType: 'image/png',
          src: 'https://example.com/image.png',
          height: 1920,
          width: 1080,
        },
        mask: {
          type: MaskTypes.RECTANGLE,
        },
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    const content = renderToStaticMarkup(
      <WithMask {...props}>
        <p>{'Hello World'}</p>
      </WithMask>
    );

    await expect(content).toContain(MaskTypes.RECTANGLE);
  });

  it('should ignore default mask when requested', async () => {
    const props = {
      element: {
        id: '123',
        isBackground: false,
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
          type: 'image',
          mimeType: 'image/png',
          src: 'https://example.com/image.png',
          height: 1920,
          width: 1080,
        },
        mask: {
          type: MaskTypes.RECTANGLE,
        },
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    const content = renderToStaticMarkup(
      <WithMask {...props} skipDefaultMask>
        <p>{'Hello World'}</p>
      </WithMask>
    );

    await expect(content).not.toContain(MaskTypes.RECTANGLE);
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output', async () => {
      const props = {
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
            type: 'image',
            mimeType: 'image/png',
            src: 'https://example.com/image.png',
            height: 1920,
            width: 1080,
          },
          mask: {
            type: 'heart',
            fill: { type: 'solid', color: { r: 255, g: 255, b: 255 } },
            style: {},
          },
        },
        box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
      };

      await expect(
        <WithMask {...props}>
          <amp-img src="https://example.com/image.png" layout="fill" />
        </WithMask>
      ).toBeValidAMPStoryElement();
    });
  });
});
