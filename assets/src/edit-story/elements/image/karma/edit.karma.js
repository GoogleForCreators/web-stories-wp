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
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';

describe('Image Editor', () => {
  let fixture;
  let elementId;
  let frame;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    // Add first image to canvas
    await fixture.events.click(fixture.editor.library.media.item(0));

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    elementId = elements[1].id;
    frame = fixture.editor.canvas.framesLayer.frame(elementId).node;
  });

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

      it('should allow image to be scaled and moved using mouse', async () => {
        // First drag the slider handle 30px right
        const slider = fixture.editor.canvas.editLayer.sizeSlider;
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(slider, 5, 5),
          down(),
          moveBy(30, 0, { steps: 2 }),
          up(),
        ]);

        await fixture.snapshot('Image scaled up');

        // Then drag image 20px left
        const image = fixture.editor.canvas.editLayer.media;
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(image, image.width / 2, image.height / 2),
          down(),
          moveBy(-20, 0, { steps: 2 }),
          up(),
        ]);

        await fixture.snapshot('Image moved');

        // Then click reset button
        const reset = fixture.editor.canvas.editLayer.sizeReset;
        await fixture.events.click(reset);

        await fixture.snapshot('Image reset');
      });

      it('should allow image to be scaled and moved using keyboard', async () => {
        // Validate that image has focus
        const slider = fixture.editor.canvas.editLayer.sizeSlider;
        const reset = fixture.editor.canvas.editLayer.sizeReset;
        const image = fixture.editor.canvas.editLayer.media;
        expect(image).toHaveFocus();

        // Press tab to move focus to slider
        await fixture.events.keyboard.press('tab');
        expect(slider).toHaveFocus();

        // First move size slider 3 steps right
        await fixture.events.keyboard.press('right');
        await fixture.events.keyboard.press('right');
        await fixture.events.keyboard.press('right');

        await fixture.snapshot('Image scaled up');

        // Press shift-tab to move focus back to image
        await fixture.events.keyboard.shortcut('shift+tab');
        expect(image).toHaveFocus();

        // Then move image 3 steps left
        await fixture.events.keyboard.press('left');
        await fixture.events.keyboard.press('left');
        await fixture.events.keyboard.press('left');

        await fixture.snapshot('Image moved');

        // Press tab twice to move focus to reset
        await fixture.events.keyboard.press('tab');
        await fixture.events.keyboard.press('tab');
        expect(reset).toHaveFocus();

        // Then press enter to activate reset button
        await fixture.events.keyboard.press('Enter');

        await fixture.snapshot('Image reset');
      });
    });
  });
});
