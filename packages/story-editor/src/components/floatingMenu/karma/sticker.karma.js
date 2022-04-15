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
import STICKERS from '@googleforcreators/stickers';
/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';
import { focusFloatingMenu, tabToCanvasFocusContainer } from './utils';

const stickerTestType = Object.keys(STICKERS)[0];

describe('Sticker Design Menu: Keyboard Navigation', () => {
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
    };

    // add sticker to canvas
    await fixture.editor.library.shapesTab.click();
    await fixture.events.click(
      fixture.editor.library.shapes.sticker(stickerTestType)
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
    expect(document.activeElement.getAttribute('title')).toBe('More');

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
    expect(selectedElement.flip.vertical).toBe(true);
    expect(selectedElement.flip.horizontal).toBe(true);
  });
});
