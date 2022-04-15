/*
 * Copyright 2022 Google LLC
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

describe('Design Menu: Navigation', () => {
  let fixture;
  let focusContainer;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    await fixture.render();
    await fixture.collapseHelpCenter();

    focusContainer = fixture.screen.getByTestId('canvas-focus-container');
  });

  afterEach(() => {
    fixture.restore();
  });

  async function tabToCanvasFocusContainer() {
    // start focused on media pane searchbar
    await fixture.editor.library.mediaTab.click();
    await fixture.events.focus(fixture.editor.library.media.searchBar);

    // tab until focus reaches the canvas container
    let count = 0;
    while (count < 15) {
      // eslint-disable-next-line no-await-in-loop -- need to await key press
      await fixture.events.keyboard.press('tab');

      if (document.activeElement === focusContainer) {
        break;
      }

      count++;
    }

    if (count >= 15) {
      throw new Error('Could not find focus container.');
    }
  }

  describe('For a rectangular shape', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.shapesTab);
      await waitFor(() => fixture.editor.library.shapes);

      await fixture.events.click(
        fixture.editor.library.shapes.shape('Rectangle')
      );

      await tabToCanvasFocusContainer();
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('Tab');
    });

    it('should navigate into and out of floating menu by keyboard', async () => {
      await fixture.events.keyboard.shortcut('control+alt+p');

      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Press Enter to edit Shape color'
      );
      // Enter the color focus group in the context menu (first item)
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('ArrowRight');

      // First focusable content is the color input
      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Shape color'
      );

      await fixture.events.keyboard.press('ArrowRight');
      // active element is still Shape color input
      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Shape color'
      );
      // Tab to the button that opens color picker
      await fixture.events.keyboard.press('tab');
      // Tab to opacity
      await fixture.events.keyboard.press('tab');
      expect(document.activeElement.getAttribute('aria-label')).toBe('Opacity');
      await fixture.events.keyboard.type('60');
      // Tab to eyedropper
      await fixture.events.keyboard.press('tab');
      // Tab out of focus trap and resume traversing menu
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('ArrowRight');
      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Press Enter to edit Corner Radius'
      );
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.type('4');
      await fixture.events.keyboard.press('tab');

      // TODO buttons find what attribute????
      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement.getAttribute('title')).toBe(
        'Flip horizontally'
      );
      await fixture.events.keyboard.press('ArrowRight');
      expect(document.activeElement.getAttribute('title')).toBe(
        'Flip vertically'
      );
      await fixture.events.keyboard.press('Space');

      await fixture.events.keyboard.press('ArrowRight');
      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Press Enter to edit Border width'
      );
      // Give border a width
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.type('6');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('ArrowRight');
      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Border color'
      );
      // Give border a color
      // Expand color popup
      await fixture.events.keyboard.press('Enter');
      // Tab from dismiss to color picker
      await fixture.events.keyboard.press('tab');
      // Tab from color picker into swatches
      await fixture.events.keyboard.press('tab');
      // Navigate down one row and to the right once
      await fixture.events.keyboard.press('ArrowDown');
      await fixture.events.keyboard.press('ArrowRight');
      // Pick this swatch
      await fixture.events.keyboard.press('Enter');
      // Back to the color input now
      await fixture.events.keyboard.press('Esc');

      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Border color'
      );
      // Arrow right to more button
      await fixture.events.keyboard.press('ArrowRight');
      expect(document.activeElement.getAttribute('title')).toBe('More');

      // Arrow right to Dismiss menu button
      await fixture.events.keyboard.press('ArrowRight');
      expect(document.activeElement.getAttribute('title')).toBe('Dismiss menu');

      // Arrow right again and end up back on the color group
      await fixture.events.keyboard.press('ArrowRight');
      expect(document.activeElement.getAttribute('aria-label')).toBe(
        'Press Enter to edit Shape color'
      );

      // Check that element actually updated
      const selectedElement = await fixture.renderHook(() =>
        useStory(({ state }) => state.currentPage.elements[1])
      );

      expect(selectedElement.backgroundColor.color.a).toBe(0.6);
      expect(selectedElement.flip.vertical).toBe(true);
      expect(selectedElement.borderRadius.topLeft).toBe(4);
      expect(selectedElement.border.left).toBe(6);
    });
  });
});
