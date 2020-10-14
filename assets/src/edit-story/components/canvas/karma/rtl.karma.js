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

describe('RTL support', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setConfig({ isRTL: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should display the editor in RTL mode', async () => {
    await fixture.snapshot('Direction: RTL');
  });

  async function getSelectedElements() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  }

  describe('CUJ: Creator can Select an Element: Transforming element', () => {
    it('should allow dragging element in RTL mode', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const elements = await getSelectedElements();
      const originX = elements[0].x;
      const frame = fixture.editor.canvas.framesLayer.frames[1].node;
      const box = frame.getBoundingClientRect();
      await fixture.events.mouse.seq(({ move, moveBy, down, up }) => [
        move(box.left + 10, box.top + 10),
        down(),
        moveBy(100, 0),
        up(),
      ]);

      const changedElements = await getSelectedElements();
      // We moved it to the right so the X should be more than before if it works as expected.
      expect(changedElements[0].width).toBeGreaterThan(originX);
      await fixture.snapshot(
        'Direction: RTL. Default Text element moved to the right.'
      );
    });

    it('should allow resizing element in RTL mode', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const elements = await getSelectedElements();
      const originWidth = elements[0].width;
      const resizeW = fixture
        .querySelector('.moveable-e')
        .getBoundingClientRect();
      await fixture.events.mouse.seq(({ move, moveBy, down, up }) => [
        move(resizeW.left + 1, resizeW.top + 1),
        down(),
        moveBy(200, 0),
        up(),
      ]);

      const changedElements = await getSelectedElements();
      // We resized it from the right handle so the width should be higher than before.
      expect(changedElements[0].width).toBeGreaterThan(originWidth);
      await fixture.snapshot(
        'Direction: RTL. Default Text element resized wider.'
      );
    });
  });
});
