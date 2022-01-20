/*
 * Copyright 2021 Google LLC
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
import { PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { pageBackgroundTextLowContrast } from '../pageBackgroundLowTextContrast';

describe('pageBackgroundTextLowContrast', () => {
  const bgEl = {
    id: 'bgEl-id',
    x: 1,
    y: 1,
    type: 'shape',
    isBackground: true,
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH,
    backgroundColor: {
      color: {
        r: 255,
        g: 255,
        b: 255,
      },
    },
  };
  const textEl = {
    id: 'textEl -id',
    type: 'text',
    backgroundTextMode: 'NONE',
    content: 'Fill with text',
    x: 1,
    y: 1,
    width: 175,
    height: 36,
    fontSize: 12,
  };
  const page = {
    id: 123,
    pageSize: {
      height: PAGE_HEIGHT,
      width: PAGE_WIDTH,
    },
    elements: [bgEl, textEl],
    backgroundColor: {
      color: {
        r: 2,
        g: 12,
        b: 1,
      },
    },
  };

  it('should return an array of ids if the default font (no spans, no colors added) does not have high enough contrast with the page', async () => {
    const check = await pageBackgroundTextLowContrast(page);
    await expect(check[0].id).toBe(textEl.id);
  });
  it('should return an array containing isBackground if the default font does not have high enough contrast with the background element', async () => {
    const check = await pageBackgroundTextLowContrast(page);
    await expect(check[0].isBackground).toBeTrue();
  });
  it('should return an array containing isBackground = false if the contrast issue is cause by an overlapped element', async () => {
    const overlappedElement = {
      ...bgEl,
      isBackground: false,
    };

    const smallGreyTextEl = {
      ...textEl,
      content: '<span style="color:#777777">I woke up like this</span>',
    };

    const check = await pageBackgroundTextLowContrast({
      ...page,
      elements: [overlappedElement, smallGreyTextEl],
    });
    await expect(check[0].isBackground).toBeFalse();
  });
  it('should return an empty array if the text size is large enough', async () => {
    const largeGreyTextEl = {
      ...textEl,
      content: '<span style="color:#777777">I woke up like this</span>',
      fontSize: 84,
    };
    const smallGreyTextEl = {
      ...textEl,
      content: '<span style="color:#777777">I woke up like this</span>',
    };

    const whiteBgPage = {
      ...page,
      backgroundColor: {
        color: {
          r: 255,
          g: 255,
          b: 255,
        },
      },
    };
    const pass = await pageBackgroundTextLowContrast({
      ...whiteBgPage,
      elements: [bgEl, largeGreyTextEl],
    });
    expect(pass).toHaveLength(0);
    const fail = await pageBackgroundTextLowContrast({
      ...whiteBgPage,
      elements: [bgEl, smallGreyTextEl],
    });
    expect(fail[0].id).toContain(textEl.id);
  });

  it('should return an empty array if the contrast is great enough', async () => {
    const whiteBackgroundColor = { color: { r: 255, g: 255, b: 255 } };
    const check = await pageBackgroundTextLowContrast({
      ...page,
      backgroundColor: whiteBackgroundColor,
    });
    expect(check).toHaveLength(0);
  });
});
