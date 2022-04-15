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
import { useStory } from '../../../app/story';
import { Fixture } from '../../../karma';
import { focusFloatingMenu, tabToCanvasFocusContainer } from './utils';

describe('Design Menu: Keyboard Navigation', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should never pass focus to floating menu when using keyboard from outside of canvas', async () => {
    // add a shape to the canvas so that a floating menu is visible
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    const toolbar = fixture.screen.getByRole('toolbar');

    // Now let's focus the footer and tab a few times. We should never run into the floating menu or its focusable content.

    const { checklistToggle } = fixture.editor.footer;

    await fixture.events.click(checklistToggle);
    await fixture.events.sleep(300); // allow transition to play out
    // close the checklist again, we're using it as a focus anchor
    await fixture.events.click(checklistToggle);
    // Floating menus are after the footer popups in the tab order, so if it was going to be selected it would happen after the footer content.
    let count = 0;
    while (count < 15) {
      // eslint-disable-next-line no-await-in-loop -- need to await key press
      await fixture.events.keyboard.press('tab');

      expect(toolbar).not.toContain(document.activeElement);

      count++;
    }
  });

  // TODO
  // it('should never pass focus to a floating menu when multiple elements are selected', () => {});

  it('should return focus to element on esc', async () => {
    const focusContainer = fixture.screen.getByTestId('canvas-focus-container');
    // add a shape to the canvas so that a floating menu is visible
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    await tabToCanvasFocusContainer(focusContainer, fixture);
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.press('Tab');

    await focusFloatingMenu(fixture);
    await fixture.events.keyboard.press('ArrowRight');

    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement.getAttribute('title')).toBe(
      'Flip horizontally'
    );

    // now go back to the element to move it around
    await fixture.events.keyboard.press('esc');

    const selectedElement = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1])
    );

    expect(document.activeElement.getAttribute('data-element-id')).toBe(
      selectedElement.id
    );
    expect(selectedElement.x).toBe(48);

    // scoot the element to the right
    await fixture.events.keyboard.press('ArrowRight');

    const updatedSelectedElement = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1])
    );
    expect(updatedSelectedElement.x).toBe(58);
  });
});
