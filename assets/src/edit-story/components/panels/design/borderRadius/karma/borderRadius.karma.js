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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('Border Radius Panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  describe('CUJ: Creator can Manipulate Shape: Border Radius', () => {
    it('should allow the user to add border radius for text element', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      // Choose Fill as background for visibility.
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStyle.fill.button
      );

      const panel = fixture.editor.inspector.designPanel.borderRadius;
      await fixture.events.click(panel.radius(), { clickCount: 3 });
      await fixture.events.keyboard.type('30');
      await fixture.events.keyboard.press('tab');

      const [element] = await getSelection();
      // Since the default state is locked, verify that all the values were set to 30.
      expect(element.borderRadius).toEqual(
        jasmine.objectContaining({
          topLeft: 30,
          topRight: 30,
          bottomLeft: 30,
          bottomRight: 30,
        })
      );

      // Take off lock.
      await fixture.events.click(panel.lockBorderRadius.button);

      await fixture.events.click(panel.radius('Top left'), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      // Verify the value change only for the top-left corner.
      const [updatedElement] = await getSelection();
      expect(updatedElement.borderRadius.topLeft).toBe(10);
      expect(updatedElement.borderRadius.topRight).toBe(30);

      await fixture.snapshot('Text element with border radius');
    });

    it('should allow user to add border radius for media', async () => {
      await fixture.events.click(fixture.editor.library.media.item(0));
      const panel = fixture.editor.inspector.designPanel.borderRadius;

      // Take off lock.
      await fixture.events.click(panel.lockBorderRadius.button);
      await fixture.events.click(panel.radius('Bottom left'), {
        clickCount: 3,
      });
      await fixture.events.keyboard.type('50');
      await fixture.events.keyboard.press('tab');

      const [element] = await getSelection();
      const {
        borderRadius: { topLeft, topRight, bottomLeft, bottomRight },
      } = element;
      expect(topLeft).toBe(0);
      expect(topRight).toBe(0);
      expect(bottomLeft).toBe(50);
      expect(bottomRight).toBe(0);
      expect(element.borderRadius).toEqual(
        jasmine.objectContaining({
          topLeft: 0,
          topRight: 0,
          bottomLeft: 50,
          bottomRight: 0,
        })
      );

      await fixture.snapshot('Media element with bottom left corner radius');
    });
  });

  it('should allow user to add border radius for shape if rectangular', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    const panel = fixture.editor.inspector.designPanel.borderRadius;
    await fixture.events.click(panel.radius(), {
      clickCount: 3,
    });
    await fixture.events.keyboard.type('50');
    await fixture.events.keyboard.press('tab');

    const [element] = await getSelection();
    const {
      borderRadius: { topLeft },
    } = element;
    expect(topLeft).toBe(50);
    await fixture.snapshot('Shape element with locked border radius');
  });

  it('should not allow border for non-rectangular shape', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Circle'));
    // Verify that panel is not found.
    expect(() => fixture.editor.inspector.designPanel.borderRadius).toThrow();
  });
});
