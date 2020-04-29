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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { TestDisplayElement } from '../../../components/canvas/test/_utils';

describe('MediaDisplay', () => {
  let element;
  let storyContext;
  let refs;

  beforeEach(() => {
    element = {
      id: '1',
      type: 'image',
      x: 0,
      y: 0,
      width: 80,
      height: 100,
      rotationAngle: 0,
      scale: 100,
      focalX: 50,
      focalY: 50,
      resource: {
        type: 'image',
        mimeType: 'image/png',
        src: 'https://example.com/image1',
        width: 1000,
        height: 800,
      },
    };

    storyContext = {};
    refs = {};
  });

  it('should render img with scale and focal point', () => {
    const { container } = render(
      <TestDisplayElement storyContext={storyContext} element={element} />
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
        element={element}
      />
    );

    const {
      actions: { pushTransform },
    } = refs.transformContext;

    const img = container.querySelector('img');

    // Start with empty style.
    expect(img.style.cssText).toBe('');

    // Resize to 100:80 (or 1:1 with the original size).
    pushTransform(element.id, { resize: [100, 80] });
    expect(img.style.cssText).not.toBe('');
    expect(img.style).toMatchObject({
      width: '100px',
      height: '80px',
      left: '0px',
      top: '0px',
    });

    // Reset.
    pushTransform(element.id, null);
    expect(img.style.cssText).toBe('');
  });
});
