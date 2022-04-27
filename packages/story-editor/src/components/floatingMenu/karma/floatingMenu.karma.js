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

  async function addElementsToCanvas() {
    /**
     * Element order:
     * 0: backgroundAudio
     * 1: image
     * 2: text
     * 3: shape
     * */
    // add an image to the canvas first since that element is open in side panel by default
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );
    // next let's add a text element
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));

    // add now let's add a shape to the canvas - this is the floating menu that will be visible.
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );
  }

  it('should never pass focus to floating menu when using keyboard from outside of canvas', async () => {
    // add a shape to the canvas so that a floating menu is visible
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

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

      expect(fixture.editor.canvas.designMenu).not.toContain(
        document.activeElement
      );

      count++;
    }
  });

  it('should return focus to element & maintain selection on esc when only keyboard is used', async () => {
    const focusContainer = fixture.screen.getByTestId('canvas-focus-container');

    await addElementsToCanvas();

    // let's make sure it's the shape menu we're interacting with, which is the 3rd element
    await tabToCanvasFocusContainer(focusContainer, fixture);
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.press('Tab');
    await fixture.events.keyboard.press('Tab');
    await fixture.events.keyboard.press('Tab');

    await focusFloatingMenu(fixture);

    // Eyedropper is first to focus in the menu
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Pick a color from canvas'
    );

    // arrow right once to the shape color input
    await fixture.events.keyboard.press('ArrowRight');
    // arrow right again to color picker
    await fixture.events.keyboard.press('ArrowRight');

    // arrow right again to opacity
    await fixture.events.keyboard.press('ArrowRight');
    // arrow right to border radius
    await fixture.events.keyboard.press('ArrowRight');
    // arrow right again to flip
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('title')).toBe(
      'Flip horizontally'
    );

    // now go back to the element to move it around
    await fixture.events.keyboard.press('esc');

    let selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].type).toBe('shape');
    expect(selectedElements[0].x).toBe(48);

    // scoot the element to the right
    await fixture.events.keyboard.press('ArrowRight');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements[0].x).toBe(58);

    // now let's make sure that the canvas is still the active focus group
    // and we can tab through layers without exiting the canvas ever.
    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements[0].isBackground).toBe(true);

    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements[0].type).toBe('image');
  });

  it('should return focus to element & maintain selection on esc when mix of cursor and keyboard are used', async () => {
    await addElementsToCanvas();

    // click on a flip so we know that the floating menu is focused via cursor
    await fixture.events.click(
      fixture.editor.canvas.designMenu.flipHorizontal.node
    );
    expect(document.activeElement.getAttribute('title')).toBe(
      'Flip horizontally'
    );

    // now escape the floating menu via keyboard
    await fixture.events.keyboard.press('esc');

    let selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].type).toBe('shape');
    expect(selectedElements[0].x).toBe(48);

    // scoot the element to the right
    await fixture.events.keyboard.press('ArrowRight');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements[0].x).toBe(58);

    // now let's make sure that the canvas is still the active focus group
    // and we can tab through layers without exiting the canvas ever.
    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements[0].isBackground).toBe(true);

    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements[0].type).toBe('image');
  });
});
