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
import { render, act } from '@testing-library/react';
import { resourceList } from '@googleforcreators/media';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { TestDisplayElement } from './_utils';

/* eslint-disable testing-library/no-node-access, testing-library/no-container */

describe('MediaDisplay', () => {
  let imageElement;
  let videoElement;
  let storyContext;
  let refs;

  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  beforeEach(() => {
    imageElement = {
      id: 'foo',
      type: 'image',
      mimeType: 'image/png',
      x: 0,
      y: 0,
      width: 80,
      height: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      scale: 100,
      focalX: 50,
      focalY: 50,
      isBackground: false,
      resource: {
        id: 123,
        type: 'image',
        mimeType: 'image/png',
        src: 'https://example.com/image1.png',
        width: 1000,
        height: 800,
        alt: '',
        sizes: {
          medium: {
            sourceUrl: 'https://example.com/image1-mid.png',
            width: 500,
            height: 400,
            mimeType: 'image/png',
          },
          full: {
            sourceUrl: 'https://example.com/image1.png',
            width: 1000,
            height: 800,
            mimeType: 'image/png',
          },
        },
      },
    };
    videoElement = {
      id: 'baz',
      type: 'video',
      mimeType: 'video/mp4',
      scale: 1,
      origRatio: 9 / 16,
      x: 0,
      y: 0,
      height: 1920,
      width: 1080,
      rotationAngle: 0,
      cale: 100,
      focalX: 50,
      focalY: 50,
      isBackground: false,
      loop: true,
      flip: {
        vertical: false,
        horizontal: false,
      },
      resource: {
        type: 'video',
        mimeType: 'video/mp4',
        id: 123,
        src: 'https://example.com/video.mp4',
        poster: 'https://example.com/poster.png',
        height: 1920,
        width: 1080,
        length: 99,
        alt: '',
      },
    };

    storyContext = {};
    refs = {};
  });

  it('should render img with srcset, when fullsize resource is loaded', () => {
    resourceList.set(imageElement.resource.id, { type: 'fullsize' });
    const { container } = render(
      <TestDisplayElement storyContext={storyContext} element={imageElement} />
    );

    const img = container.querySelector('img');

    expect(img.srcset).toBe(
      'https://example.com/image1.png 1000w,https://example.com/image1-mid.png 500w'
    );
    // Take optimized image loading into account, fullsize uses original image
    expect(img.src).toBe(imageElement.resource.src);
  });

  it('should render img with scale and focal point', () => {
    const { container } = render(
      <TestDisplayElement storyContext={storyContext} element={imageElement} />
    );

    const img = container.querySelector('img');
    // The offset is setup to fit 1000:800 image inside 80:100 box.
    expect(window.getComputedStyle(img)).toMatchObject({
      width: '125px',
      height: '100px',
      left: '-22.5px',
      top: '0px',
    });
  });

  it('should apply and reset transformations', () => {
    const { container } = render(
      <TestDisplayElement
        refs={refs}
        storyContext={storyContext}
        element={imageElement}
      />
    );

    const {
      actions: { pushTransform },
    } = refs.transformContext;

    const img = container.querySelector('img');

    // Start with empty style.
    expect(img.style).toMatchSnapshot('empty style before');

    // Resize to 100:80 (or 1:1 with the original size).
    act(() => {
      pushTransform(imageElement.id, { resize: [100, 80] });
    });
    expect(img).toHaveStyle({
      width: '100px',
      height: '80px',
      left: '0px',
      top: '0px',
    });

    // Reset.
    act(() => {
      pushTransform(imageElement.id, null);
    });
    expect(img.style).toMatchSnapshot('empty style after');
  });

  it('should render flipped background video', () => {
    const flipCases = [
      {
        flip: { vertical: true, horizontal: false },
        transform: 'scale3d(1, -1, 1)',
      },
      {
        flip: { vertical: false, horizontal: true },
        transform: 'scale3d(-1, 1, 1)',
      },
      {
        flip: { vertical: true, horizontal: true },
        transform: 'scale3d(-1, -1, 1)',
      },
    ];

    flipCases.forEach(({ flip, transform }) => {
      const flippedBackgroundVideo = {
        ...videoElement,
        isBackground: true,
        flip,
      };
      const { container } = render(
        <TestDisplayElement
          storyContext={{
            ...storyContext,
            page: {},
          }}
          element={flippedBackgroundVideo}
        />
      );

      const element = container.querySelector(
        '[data-element-id="baz"]'
      ).firstChild;
      expect(window.getComputedStyle(element)).toMatchObject({
        transform,
      });
    });
  });
});

/* eslint-enable testing-library/no-node-access, testing-library/no-container */
