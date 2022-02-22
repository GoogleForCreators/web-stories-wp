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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';

describe('Drop-Target order', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function insertMediaByIndex(index) {
    const mediaItem = fixture.editor.library.media.item(index);
    await fixture.events.mouse.clickOn(mediaItem, 20, 20);
  }

  it('should replace top image when bg image is set and another one is on top', async () => {
    // Drag first media element straight to canvas edge to set as background
    const bgMedia = fixture.editor.library.media.item(0);
    const canvas = fixture.editor.canvas.framesLayer.fullbleed;

    await fixture.events.mouse.seq(({ down, moveRel, up }) => [
      moveRel(bgMedia, 20, 20),
      down(),
      moveRel(canvas, 10, 10),
      up(),
    ]);

    // Add one more element
    await insertMediaByIndex(1);

    // Get the elements
    const [bgImage, topImage] = await getElements(fixture);

    // Drag the top element to align with the edge without dropping in there
    const bgFrame = fixture.editor.canvas.framesLayer.frame(bgImage.id).node;
    const topFrame = fixture.editor.canvas.framesLayer.frame(topImage.id).node;
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(topFrame, 25, 25),
      down(),
      moveRel(bgFrame, 25, 25),
      up(),
    ]);

    // Now add one more element
    await insertMediaByIndex(2);

    // Get the new element
    const otherImage = (await getElements(fixture))[2];

    const otherFrame = fixture.editor.canvas.framesLayer.frame(
      otherImage.id
    ).node;

    // Drag image by edge to position of top image edge
    // (which should collide with bg image edge)
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(otherFrame, 5, 5),
      down(),
      moveRel(topFrame, 5, 5),
      up(),
    ]);

    // Expect old element to have been removed
    expect(fixture.editor.canvas.framesLayer.frame(otherImage.id)).toBeFalsy();

    const backgroundId = (await getElements(fixture))[0].id;
    // TODO: refactor after #2386?
    const topImageImg = fixture.editor.canvas.displayLayer
      .display(topImage.id)
      .node.querySelector('img');
    const backgroundImg = fixture.editor.canvas.displayLayer
      .display(backgroundId)
      .node.querySelector('img');

    await waitFor(() => {
      if (!topImageImg || !backgroundImg) {
        throw new Error('image not ready');
      }
      expect(topImageImg.src).toBe(otherImage.resource.src);
      expect(backgroundImg.src).toBe(bgImage.resource.src);
    });
  });

  it('should replace the top image when two images are in the same place on canvas', async () => {
    // Add three images - will be added on top of each other
    await insertMediaByIndex(0);
    await insertMediaByIndex(1);
    await insertMediaByIndex(2);

    // Get the elements
    const elements = await getElements(fixture);
    // Slice out the irrelevant bg element and get the next three
    const [bottomImage, topImage, otherImage] = elements.slice(1);

    const otherImageFrame = fixture.editor.canvas.framesLayer.frame(
      otherImage.id
    ).node;

    // Drag image to other image edge - they're all aligned with the
    // same top left corner.
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(otherImageFrame, 5, 5),
      down(),
      moveBy(0, 10),
      up(),
    ]);

    // Expect old element to have been removed
    expect(fixture.editor.canvas.framesLayer.frame(otherImage.id)).toBeFalsy();

    const topImageImg = fixture.editor.canvas.displayLayer
      .display(topImage.id)
      .node.querySelector('img');
    const bottomImageImg = fixture.editor.canvas.displayLayer
      .display(bottomImage.id)
      .node.querySelector('img');
    expect(topImageImg.src).toBe(otherImage.resource.src);
    expect(bottomImageImg.src).toBe(bottomImage.resource.src);
  });
});

async function getElements(fixture) {
  const {
    state: {
      currentPage: { elements },
    },
  } = await fixture.renderHook(() => useStory());
  return elements;
}
