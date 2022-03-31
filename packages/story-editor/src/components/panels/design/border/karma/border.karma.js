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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('Border Panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  describe('CUJ: Creator can Manipulate Shape: Border', () => {
    it('should allow the user to add border for text element', async () => {
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
      });
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const panel = fixture.editor.sidebar.designPanel.border;

      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('2');
      await fixture.events.keyboard.press('tab');

      const [element] = await getSelection();
      // Since the default state is locked, verify that all the values were set to 10.
      expect(element.border.left).toBe(2);
      expect(element.border.top).toBe(2);
      expect(element.border.right).toBe(2);
      expect(element.border.bottom).toBe(2);

      // Take off lock.
      await fixture.events.click(panel.lockBorderWidth);

      await fixture.events.click(panel.width('Top'), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      // Verify the value changed but stayed the same for the left width.
      const [updatedElement] = await getSelection();
      expect(updatedElement.border.left).toBe(2);
      expect(updatedElement.border.top).toBe(10);

      await fixture.snapshot('Text element with inner border');
    });

    it('should allow user to add border for media', async () => {
      // Add media element and basic border.
      const mediaItem = fixture.editor.library.media.item(0);
      await fixture.events.mouse.clickOn(mediaItem, 20, 20);
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const panel = fixture.editor.sidebar.designPanel.border;
      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('Tab');

      const borderColor = panel.borderColor;
      await fixture.events.focus(borderColor.opacity);
      await fixture.events.click(borderColor.opacity, { clickCount: 3 });
      await fixture.events.keyboard.type('30');
      await fixture.events.keyboard.press('Tab');

      await waitFor(() => {
        if (borderColor.opacity.getAttribute('value') !== '30%') {
          throw new Error('opacity not set yet');
        }
        expect(borderColor.opacity.getAttribute('value')).toBe('30%');
      });

      const [element] = await getSelection();
      const {
        border: { left, top, right, bottom, color },
      } = element;
      expect(left).toBe(10);
      expect(top).toBe(10);
      expect(right).toBe(10);
      expect(bottom).toBe(10);
      expect(color.color.a).toBe(0.3);

      await fixture.snapshot('Media element with border');
    });
  });

  it('should allow user to add border for shape', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    await fixture.events.click(fixture.editor.sidebar.designTab);
    const panel = fixture.editor.sidebar.designPanel.border;
    await fixture.events.click(panel.width(), { clickCount: 3 });
    await fixture.events.keyboard.type('5');
    await fixture.events.keyboard.press('Tab');

    const [element] = await getSelection();
    const {
      border: { right },
    } = element;
    expect(right).toBe(5);

    await fixture.snapshot('Shape element with border');
  });

  it('should allow border for non-rectangular shape', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Circle'));

    await fixture.events.click(fixture.editor.sidebar.designTab);
    const panel = fixture.editor.sidebar.designPanel.border;
    await fixture.events.click(panel.width(), { clickCount: 3 });
    await fixture.events.keyboard.type('10');
    await fixture.events.keyboard.press('Tab');

    const [element] = await getSelection();
    const {
      border: { left },
    } = element;
    expect(left).toBe(10);

    await fixture.snapshot('Non-rectangular shape element with border');

    // Verify that border cannot have opacity
    expect(() => panel.borderColor.opacity).toThrow();
  });
});
