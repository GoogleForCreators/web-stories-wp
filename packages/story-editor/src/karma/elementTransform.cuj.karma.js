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
import useInsertElement from '../components/canvas/useInsertElement';
import { useStory } from '../app/story';
import { Fixture } from './fixture';

describe('Element transform', () => {
  let fixture;
  let frame;

  const clickOnTarget = async (target) => {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
  };

  const addTextInEditMode = async () => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    const element = await fixture.act(() =>
      insertElement('text', {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
        content: 'Hello, Stories!',
      })
    );
    frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
    await clickOnTarget(frame);
  };

  const getSelectedElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0];
  };

  describe('Element: Text', () => {
    beforeEach(async () => {
      fixture = new Fixture();
      await fixture.render();
      // Add a text element and enter edit mode.
      await addTextInEditMode();
    });

    afterEach(() => {
      fixture.restore();
    });

    describe('CUJ: Creator can Transform an Element: Resize', () => {
      it('it should allow resizing in text edit mode', async () => {
        // Test that resize handle exists in edit mode.
        const rightResizeHandle = fixture.container.querySelector(
          '.moveable-control.moveable-e'
        );
        expect(rightResizeHandle).toBeDefined();

        const widthBefore = window.getComputedStyle(frame).width;
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(rightResizeHandle, 1, 1),
          down(),
          moveBy(20, 0, { steps: 1 }),
          up(),
        ]);
        const widthAfter = window.getComputedStyle(frame).width;
        expect(parseInt(widthAfter) - parseInt(widthBefore)).toBe(20);
      });
    });

    describe('CUJ: Creator can Transform an Element: Rotate', () => {
      it('it should allow rotating in text edit mode', async () => {
        // Test that rotation handle exists in edit mode.
        const rotationHandle = fixture.container.querySelector(
          '.moveable-rotation-line .moveable-control'
        );
        expect(rotationHandle).toBeDefined();

        const elementBefore = await getSelectedElement();
        expect(elementBefore.rotationAngle).toEqual(0);
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(rotationHandle, 3, 5),
          down(),
          moveBy(10, 0, { steps: 1 }),
          up(),
        ]);
        const elementAfter = await getSelectedElement();
        await expect(elementAfter.rotationAngle).not.toEqual(0);
      });
    });
  });
});
