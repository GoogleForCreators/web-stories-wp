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
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';

describe('Design Menu: Border width & color', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    try {
      await fixture.render();
    } catch {
      // ignore
    }

    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelectedElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0];
  };

  describe('For a rectangular shape', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.shapesTab);
      await waitFor(() => fixture.editor.library.shapes);

      await fixture.events.click(
        fixture.editor.library.shapes.shape('Rectangle')
      );
    });

    it('should render border width but only color once width is non-zero', async () => {
      expect(fixture.editor.canvas.designMenu.borderWidth).not.toBeNull();
      expect(fixture.editor.canvas.designMenu.borderColor).toBeNull();

      // Open style pane
      await fixture.events.click(fixture.editor.sidebar.designTab);

      const panel = fixture.editor.sidebar.designPanel.border;
      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      expect(fixture.editor.canvas.designMenu.borderWidth).not.toBeNull();
      expect(fixture.editor.canvas.designMenu.borderColor).not.toBeNull();
    });

    it('should render border width and color if widths are unlocked but equal', async () => {
      // Open style pane
      await fixture.events.click(fixture.editor.sidebar.designTab);

      const panel = fixture.editor.sidebar.designPanel.border;
      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      await fixture.events.click(panel.lockBorderWidth);

      expect(fixture.editor.canvas.designMenu.borderWidth).not.toBeNull();
      expect(fixture.editor.canvas.designMenu.borderColor).not.toBeNull();
    });

    it('should not render border width but still color if widths are uneven', async () => {
      // Open style pane
      await fixture.events.click(fixture.editor.sidebar.designTab);

      const panel = fixture.editor.sidebar.designPanel.border;
      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      await fixture.events.click(panel.lockBorderWidth);

      await fixture.events.click(panel.width('Right'), { clickCount: 3 });
      await fixture.events.keyboard.type('20');
      await fixture.events.keyboard.press('tab');

      expect(fixture.editor.canvas.designMenu.borderWidth).toBeNull();
      expect(fixture.editor.canvas.designMenu.borderColor).not.toBeNull();
    });

    it('should actually set the border width and color when updated', async () => {
      await fixture.events.click(fixture.editor.canvas.designMenu.borderWidth, {
        clickCount: 3,
      });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      await fixture.events.click(
        fixture.editor.canvas.designMenu.borderColor.button
      );

      await fixture.events.click(
        fixture.editor.canvas.designMenu.borderColor.picker.defaultColor(
          '#800f2f'
        )
      );

      const { border } = await getSelectedElement();
      expect(border).toEqual(
        jasmine.objectContaining({
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          color: { color: { r: 128, g: 15, b: 47 } },
        })
      );
    });
  });

  describe('For a non-rectangular shape', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.shapesTab);
      await waitFor(() => fixture.editor.library.shapes);

      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );
    });

    it('should render border width but only color once width is non-zero', async () => {
      expect(fixture.editor.canvas.designMenu.borderWidth).not.toBeNull();
      expect(fixture.editor.canvas.designMenu.borderColor).toBeNull();

      // Open style pane
      await fixture.events.click(fixture.editor.sidebar.designTab);

      const panel = fixture.editor.sidebar.designPanel.border;
      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      expect(fixture.editor.canvas.designMenu.borderWidth).not.toBeNull();
      expect(fixture.editor.canvas.designMenu.borderColor).not.toBeNull();
    });

    it('should not allow opacity in color picker', async () => {
      // Open style pane
      await fixture.events.click(fixture.editor.sidebar.designTab);

      const panel = fixture.editor.sidebar.designPanel.border;
      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('tab');

      await fixture.events.click(
        fixture.editor.canvas.designMenu.borderColor.button
      );

      const transparentButton =
        fixture.editor.canvas.designMenu.borderColor.picker.defaultColor(
          'rgba(0,0,0,0)'
        );

      expect(transparentButton.hasAttribute('disabled')).toBe(true);
    });
  });
});
