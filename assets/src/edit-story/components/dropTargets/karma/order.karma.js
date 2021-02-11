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
import { waitForElementToBeRemoved, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useInsertElement } from '../../../components/canvas';
import { getBackgroundElementId } from './background.karma';

describe('Drop-Target order', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should replace top image when bg image is set and another one is on top', async () => {
    const insertElement = await fixture.renderHook(() => useInsertElement());

    const bgImage = await fixture.act(() =>
      insertElement('image', earthImageProps)
    );
    const setAsBackground = fixture.screen.getByRole('button', {
      name: 'Set as background',
    });
    await fixture.events.click(setAsBackground);

    const topImage = await fixture.act(() =>
      insertElement('image', marsImageProps)
    );

    const replacementImage = await fixture.act(() =>
      insertElement('image', curiosityImageProps)
    );
    const replacementImageFrame = fixture.editor.canvas.framesLayer.frame(
      replacementImage.id
    ).node;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(replacementImageFrame, 10, 10),
      down(),
      moveBy(0, -20),
      up(),
    ]);
    await waitForElementToBeRemoved(replacementImageFrame);
    const backgroundId = await getBackgroundElementId(fixture);
    // TODO: refactor after #2386?
    const topImageImg = fixture.editor.canvas.displayLayer
      .display(topImage.id)
      .node.querySelector('img');
    const backgroundImg = fixture.editor.canvas.displayLayer
      .display(backgroundId)
      .node.querySelector('img');
    // TODO: improve with custom matchers
    await waitFor(() => {
      expect(topImageImg.src).toBe(replacementImage.resource.src);
      expect(backgroundImg.src).toBe(bgImage.resource.src);
    });
  });

  it('should replace the top image when two images are in the same place on canvas', async () => {
    const insertElement = await fixture.renderHook(() => useInsertElement());

    const bottomImage = await fixture.act(() =>
      insertElement('image', { ...earthImageProps, x: 100, y: 100 })
    );

    const topImage = await fixture.act(() =>
      insertElement('image', { ...marsImageProps, x: 100, y: 100 })
    );

    const replacementImage = await fixture.act(() =>
      insertElement('image', { ...curiosityImageProps, x: 100, y: 100 })
    );
    const replacementImageFrame = fixture.editor.canvas.framesLayer.frame(
      replacementImage.id
    ).node;

    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(replacementImageFrame, 10, 10),
      down(),
      moveBy(0, 10),
      up(),
    ]);
    await waitForElementToBeRemoved(replacementImageFrame);
    const topImageImg = fixture.editor.canvas.displayLayer
      .display(topImage.id)
      .node.querySelector('img');
    const bottomImageImg = fixture.editor.canvas.displayLayer
      .display(bottomImage.id)
      .node.querySelector('img');
    expect(topImageImg.src).toBe(replacementImage.resource.src);
    expect(bottomImageImg.src).toBe(bottomImage.resource.src);
  });
});

const earthImageProps = {
  x: 0,
  y: 0,
  width: 640 / 2,
  height: 529 / 2,
  resource: {
    type: 'image',
    mimeType: 'image/jpg',
    src: 'http://localhost:9876/__static__/earth.jpg',
  },
};
const marsImageProps = {
  x: 0,
  y: 0,
  width: 540 / 2,
  height: 810 / 2,
  resource: {
    type: 'image',
    mimeType: 'image/jpg',
    src: 'http://localhost:9876/__static__/mars.jpg',
  },
};
const curiosityImageProps = {
  x: 0,
  y: 20,
  width: 953 / 6,
  height: 1280 / 6,
  resource: {
    type: 'image',
    mimeType: 'image/jpg',
    src: 'http://localhost:9876/__static__/curiosity.jpg',
  },
};
