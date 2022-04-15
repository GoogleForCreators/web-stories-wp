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
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';
import { focusFloatingMenu, tabToCanvasFocusContainer } from './utils';

describe('Video Design Menu: Keyboard Navigation', () => {
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
      opacity: {
        keyboard: '60',
        result: 60,
      },
      borderWidth: {
        keyboard: '6',
        result: 6,
      },
    };
    // Add a video to canvas
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(5),
      20,
      20
    );

    await tabToCanvasFocusContainer(focusContainer, fixture);
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.press('Tab');

    await focusFloatingMenu(fixture);

    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Press Enter to edit Opacity in percent'
    );

    await fixture.events.keyboard.press('Enter');

    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Opacity in percent'
    );
    await fixture.events.keyboard.type(elementUpdates.opacity.keyboard);

    // Tab out of input back to menu navigation
    await fixture.events.keyboard.press('tab');

    await fixture.events.keyboard.press('ArrowRight');

    // Proceed to flips
    expect(document.activeElement.getAttribute('title')).toBe(
      'Flip horizontally'
    );
    await fixture.events.keyboard.press('Space');

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
    // Arrow right to loop
    await fixture.events.keyboard.press('ArrowRight');

    // checkbox focuses, it gets labelled by its label but that's not getting picked up on in the active element.
    expect(document.activeElement.getAttribute('type')).toBe('checkbox');
    // Loop the video
    await fixture.events.keyboard.press('Space');

    // Arrow right to more button
    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement.getAttribute('title')).toBe('More');

    // Arrow right to Dismiss menu button
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('title')).toBe('Dismiss menu');
    // Arrow right again and end up back on the opacity
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Press Enter to edit Opacity in percent'
    );

    // Check that element actually updated
    const selectedElement = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1])
    );

    expect(selectedElement.opacity).toBe(elementUpdates.opacity.result);
    expect(selectedElement.flip.horizontal).toBe(true);
    expect(selectedElement.loop).toBe(true);
    expect(selectedElement.border.left).toBe(elementUpdates.borderWidth.result);
    // we just want to know that the keyboard nav picked a non default color value;
    expect(selectedElement.border.color.color).not.toBe({ r: 0, g: 0, b: 0 });
  });
});
