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
import { focusFloatingMenu, tabToCanvasFocusContainer } from './utils';

describe('Shape Design Menu: Keyboard Navigation', () => {
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

  it('should navigate into and out of floating menu by keyboard', async () => {
    const elementUpdates = {
      backgroundColor: {
        keyboard: '787800',
        result: {
          r: 120,
          g: 120,
          b: 0,
        },
      },
      backgroundOpacity: {
        keyboard: '60',
        result: { a: 0.6 },
      },
      borderRadius: {
        keyboard: '4',
        result: 4,
      },
      borderWidth: {
        keyboard: '6',
        result: 6,
      },
    };

    // Add a shape to the canvas
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    await tabToCanvasFocusContainer(focusContainer, fixture);
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.press('Tab');

    await focusFloatingMenu(fixture);

    // Eyedropper is first to focus in the menu
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Pick a color from canvas'
    );

    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Press Enter to edit Shape color'
    );
    // Press enter and update color hex
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.type(elementUpdates.backgroundColor.keyboard);
    await fixture.events.keyboard.press('Tab');
    // The square is green now, let's just make sure the color picker is navigable and then carry on.
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Shape color'
    );
    await fixture.events.keyboard.press('Enter');
    // Tab from dismiss to color picker
    await fixture.events.keyboard.press('tab');
    // Tab from color picker into swatches
    await fixture.events.keyboard.press('tab');
    // Navigate down one row and to the right once
    await fixture.events.keyboard.press('ArrowDown');
    await fixture.events.keyboard.press('ArrowRight');
    // Back to the color input now
    await fixture.events.keyboard.press('Esc');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Shape color'
    );
    await fixture.events.keyboard.press('ArrowRight');

    // Tab to opacity
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Press Enter to edit Opacity'
    );
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.type(
      elementUpdates.backgroundOpacity.keyboard
    );

    // Tab out of focus trap and resume traversing menu
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Press Enter to edit Corner Radius'
    );
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.type(elementUpdates.borderRadius.keyboard);
    await fixture.events.keyboard.press('tab');

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
    await fixture.events.keyboard.type(elementUpdates.borderWidth.keyboard);
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

    // Arrow right twice and end up back on the color input
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Pick a color from canvas'
    );
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Press Enter to edit Shape color'
    );

    // Check that element actually updated
    const selectedElement = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1])
    );

    expect(selectedElement.backgroundColor.color).toEqual({
      ...elementUpdates.backgroundColor.result,
      ...elementUpdates.backgroundOpacity.result,
    });
    expect(selectedElement.flip.vertical).toBe(true);
    expect(selectedElement.borderRadius.topLeft).toBe(
      elementUpdates.borderRadius.result
    );
    expect(selectedElement.border.left).toBe(elementUpdates.borderWidth.result);
    // we just want to know that the keyboard nav picked a non default color value;
    expect(selectedElement.border.color.color).not.toBe({ r: 0, g: 0, b: 0 });
  });
});
