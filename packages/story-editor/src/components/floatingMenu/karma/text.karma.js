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

describe('Text Design Menu: Keyboard Navigation', () => {
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
      fontSize: {
        keyboard: '30',
        result: 30,
      },
      textAlign: {
        result: 'center',
      },
    };

    // Add text to the canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));

    await tabToCanvasFocusContainer(focusContainer, fixture);
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.press('Tab');

    await focusFloatingMenu(fixture);

    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Font family'
    );
    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Press Enter to edit Font size'
    );

    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.type(elementUpdates.fontSize.keyboard);
    await fixture.events.keyboard.press('Tab');

    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Change text alignment'
    );
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.press('ArrowRight');
    // Update alignment to be centered
    await fixture.events.keyboard.press('Enter');
    // return focus to the dropdown group
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Change text alignment'
    );
    // Proceed to text style toggles
    await fixture.events.keyboard.press('ArrowRight');
    // Make it bold
    expect(document.activeElement.getAttribute('title')).toBe('Toggle bold');
    await fixture.events.keyboard.press('Enter');
    await fixture.events.keyboard.press('ArrowRight');
    // Make it italic
    expect(document.activeElement.getAttribute('title')).toBe('Toggle italic');
    await fixture.events.keyboard.press('Space');
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('title')).toBe(
      'Toggle underline'
    );
    // Proceed to color
    await fixture.events.keyboard.press('ArrowRight');
    // eyedropper
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Pick a color from canvas'
    );

    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Text color'
    );
    await fixture.events.keyboard.press('Enter');
    // Tab from dismiss to color picker
    await fixture.events.keyboard.press('tab');
    // Tab from color picker into swatches, go past saved colors
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    // Navigate down one row and to the right once
    await fixture.events.keyboard.press('ArrowDown');
    await fixture.events.keyboard.press('ArrowRight');
    // Select this color
    await fixture.events.keyboard.press('Enter');
    // Back to the color input now
    await fixture.events.keyboard.press('Esc');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Text color'
    );

    // Proceed to more
    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement.getAttribute('title')).toBe('More');

    // Arrow right to Dismiss menu button
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('title')).toBe('Dismiss menu');

    // Arrow right again and end up back on the font family
    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.getAttribute('aria-label')).toBe(
      'Font family'
    );

    // Check that element actually updated
    const selectedElement = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1])
    );
    expect(selectedElement.fontSize).toBe(elementUpdates.fontSize.result);
    expect(selectedElement.textAlign).toBe(elementUpdates.textAlign.result);
    // bold and italic are inline with content
    expect(selectedElement.content).toContain('font-weight: 700');
    expect(selectedElement.content).toContain('font-style: italic');
  });
});
