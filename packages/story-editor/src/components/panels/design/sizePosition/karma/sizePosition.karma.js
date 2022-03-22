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

describe('Selection Panel', () => {
  let fixture;
  let panel;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  const selectTarget = async (target) => {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.keyboard.down('Shift');
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
    await fixture.events.keyboard.up('Shift');
  };

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  describe('CUJ: Creator can Transform an Element: Set height and width', () => {
    it('should have correct default aspect ratio lock values', async () => {
      const mediaItem = fixture.editor.library.media.item(0);
      await fixture.events.mouse.clickOn(mediaItem, 20, 20);
      const [image] = await getSelection();
      expect(image.lockAspectRatio).toBeFalse();

      await fixture.events.click(fixture.editor.library.shapesTab);
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );
      const [triangle] = await getSelection();
      expect(triangle.lockAspectRatio).toBeTrue();

      await fixture.events.click(
        fixture.editor.library.shapes.shape('Rectangle')
      );
      const [rectangle] = await getSelection();
      expect(rectangle.lockAspectRatio).toBeFalse();

      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      const [text] = await getSelection();
      expect(text.lockAspectRatio).not.toBeFalse();
    });

    it('should allow the user to change the height & width of a text element', async () => {
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      await fixture.events.click(fixture.editor.inspector.designTab);
      panel = fixture.editor.inspector.designPanel.sizePosition;

      // Store original width and height
      const ratio = panel.width.value / panel.height.value;

      await fixture.events.click(panel.width);
      await fixture.events.keyboard.type('300');
      await fixture.events.keyboard.press('tab');

      const [element] = await getSelection();
      expect(element.width).toBe(300);
      const newHeight = element.height;
      expect(Math.round(newHeight)).toBe(Math.round(300 / ratio));

      // Take off lock ratio by clicking on the visible part of the lock aspect ratio checkbox.
      await fixture.events.click(panel.lockAspectRatio);
      expect(panel.height.placeholder).toBe('Auto');
      expect(panel.height.disabled).toBeTrue();

      await fixture.snapshot('Unlocked element with height disabled');

      await fixture.events.click(panel.width);
      await fixture.events.keyboard.type('100');
      await fixture.events.keyboard.press('tab');

      const [updatedElement] = await getSelection();
      expect(updatedElement.height).toBe(newHeight);
    });

    it('should disable setting height independently of multi-selection containing text', async () => {
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);

      // Switch to shapes tab and click the triangle
      await fixture.events.click(fixture.editor.inspector.insertTab);
      await fixture.events.click(fixture.editor.library.shapesTab);
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );
      // Select the text, too.
      await selectTarget(fixture.editor.canvas.framesLayer.frames[1].node);

      const elements = await getSelection();
      const oHeight1 = elements[0].height;
      const oHeight2 = elements[1].height;

      // Take off lock ratio by clicking on the visible part of the lock aspect ratio checkbox.
      await fixture.events.click(fixture.editor.inspector.designTab);
      panel = fixture.editor.inspector.designPanel.sizePosition;
      await fixture.events.click(panel.lockAspectRatio);
      expect(panel.height.placeholder).toBe('Auto');

      await fixture.snapshot('Unlocked multi-selection with height disabled');

      expect(panel.height.value).toBe('');
      expect(panel.height.placeholder).toBe('Auto');
      expect(panel.height.disabled).toBeTrue();
      await fixture.events.click(panel.width);
      await fixture.events.keyboard.type('300');
      await fixture.events.keyboard.press('tab');

      const updatedElements = await getSelection();
      // The height of the text was reduced automatically due to the number of rows decreasing.
      expect(updatedElements[0].height).toBeLessThanOrEqual(oHeight1);
      expect(updatedElements[1].height).toBe(oHeight2);
    });
  });
});
