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
 * Internal dependencies
 */
import { Fixture } from '../../fixture';
import { useStory } from '../../../app/story';

describe('Image Editor', () => {
  let fixture;
  let elementId;
  let frame;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    // Add first image to canvas
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(fixture.editor.library.media.item(0), '30%', '30%'),
      down(),
      up(),
    ]);

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    elementId = elements[1].id;
    frame = fixture.editor.canvas.framesLayer.frame(elementId).node;
  });

  async function getCurrentImageData() {
    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    return elements[1];
  }

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Enter edit mode', () => {
    it('should render initial content', () => {
      expect(frame).toBeTruthy();
    });

    describe('edit mode', () => {
      beforeEach(async () => {
        await fixture.events.click(frame);
        await fixture.events.click(frame);
      });

      it('should mount editor', async () => {
        expect(fixture.editor.canvas.editLayer.media).toBeTruthy();
        await fixture.snapshot();
      });

      it('should have no aXe violations', async () => {
        await expectAsync(
          fixture.editor.canvas.editLayer.node
        ).toHaveNoViolations();
      });

      it('should allow image to be scaled and moved using mouse', async () => {
        const image = fixture.editor.canvas.editLayer.media;
        const originalRect = image.getBoundingClientRect();
        const originalImageData = await getCurrentImageData();

        // First drag the slider handle 30px right
        const slider = fixture.editor.canvas.editLayer.sizeSlider;
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(slider, 5, 5),
          down(),
          moveBy(30, 0, { steps: 2 }),
          up(),
        ]);

        // Expect image to be scaled up
        const scaledUpRect = image.getBoundingClientRect();
        expect(scaledUpRect.width).toBeGreaterThan(originalRect.width);
        expect(scaledUpRect.height).toBeGreaterThan(originalRect.height);

        await fixture.snapshot('Image scaled up');

        // Expect global image data to be unchanged while in editor
        const imageDataAfterScale = await getCurrentImageData();
        expect(imageDataAfterScale).toEqual(originalImageData);

        // Then drag image 20px left
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(image, image.width / 2, image.height / 2),
          down(),
          moveBy(-20, 0, { steps: 2 }),
          up(),
        ]);

        // Expect image to be moved left, not up or down
        const movedRect = image.getBoundingClientRect();
        expect(movedRect.left).toBeLessThan(scaledUpRect.left);
        expect(movedRect.top).toBe(scaledUpRect.top);
        await fixture.snapshot('Image moved');

        // Expect global image data to still be unchanged while in editor
        const imageDataAfterDrag = await getCurrentImageData();
        expect(imageDataAfterDrag).toEqual(originalImageData);

        // Click outside image to exit edit-mode
        await fixture.events.mouse.seq(({ moveRel, down, up }) => [
          moveRel(image, -10, -10),
          down(),
          up(),
        ]);
        await fixture.snapshot('Image editor exited');

        // Expect global image data to now be changed after exiting in editor
        const imageDataAfterExit = await getCurrentImageData();
        expect(imageDataAfterExit).not.toEqual(originalImageData);
      });

      it('should allow image to be scaled and moved using keyboard', async () => {
        const originalImageData = await getCurrentImageData();

        // Validate that image has focus
        const slider = fixture.editor.canvas.editLayer.sizeSlider;
        const image = fixture.editor.canvas.editLayer.media;
        expect(image).toHaveFocus();

        const originalRect = image.getBoundingClientRect();

        // Press tab to move focus to slider
        await fixture.events.keyboard.press('tab');
        expect(slider).toHaveFocus();

        // First move size slider 3 steps right
        await fixture.events.keyboard.press('right');
        await fixture.events.keyboard.press('right');
        await fixture.events.keyboard.press('right');

        // Expect image to be scaled up
        const scaledUpRect = image.getBoundingClientRect();
        expect(scaledUpRect.width).toBeGreaterThan(originalRect.width);
        expect(scaledUpRect.height).toBeGreaterThan(originalRect.height);

        await fixture.snapshot('Image scaled up');

        // Expect global image data to be unchanged while in editor
        const imageDataAfterScale = await getCurrentImageData();
        expect(imageDataAfterScale).toEqual(originalImageData);

        // Press shift-tab to move focus back to image
        await fixture.events.keyboard.shortcut('shift+tab');
        expect(image).toHaveFocus();

        // Then move image 3 steps left
        await fixture.events.keyboard.press('left');
        await fixture.events.keyboard.press('left');
        await fixture.events.keyboard.press('left');

        // Expect image to be moved left, not up or down
        const movedRect = image.getBoundingClientRect();
        expect(movedRect.left).toBeLessThan(scaledUpRect.left);
        expect(movedRect.top).toBe(scaledUpRect.top);
        await fixture.snapshot('Image moved');

        // Expect global image data to still be unchanged while in editor
        const imageDataAfterDrag = await getCurrentImageData();
        expect(imageDataAfterDrag).toEqual(originalImageData);

        // Click 'esc' to exit edit-mode
        await fixture.events.keyboard.press('esc');
        await fixture.snapshot('Image editor exited');

        // Expect global image data to now be changed after exiting in editor
        const imageDataAfterExit = await getCurrentImageData();
        expect(imageDataAfterExit).not.toEqual(originalImageData);
      });

      it('should allow image to be scaled using mouse-wheel', async () => {
        // Validate that image has focus
        const image = fixture.editor.canvas.editLayer.media;
        expect(image).toHaveFocus();
        const originalRect = image.getBoundingClientRect();

        // Scale image up by scrolling three steps
        await fixture.events.mouse.moveRel(image, 10, 10);
        await fixture.events.mouse.wheel({ deltaY: 1 });
        await fixture.events.mouse.wheel({ deltaY: 1 });
        await fixture.events.mouse.wheel({ deltaY: 1 });

        // Expect image to be scaled up
        const scaledUpRect = image.getBoundingClientRect();
        expect(scaledUpRect.width).toBeGreaterThan(originalRect.width);
        expect(scaledUpRect.height).toBeGreaterThan(originalRect.height);
        await fixture.snapshot('Image scaled up');
      });
    });
  });
});
