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
/**
 * External dependencies
 */
import { waitFor } from '@testing-library/dom';
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';

describe('Canvas Element - keyboard navigation', () => {
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

  function getCanvasElementWrapperById(id) {
    return fixture.querySelector(
      `[data-testid="frameElement"][data-element-id="${id}"]`
    );
  }

  it('should be able to navigate in and out of the floating menu with ctrl+alt+p & esc', async () => {
    // Insert an element
    const shapeTab = fixture.editor.library.shapesTab;
    await fixture.events.click(shapeTab);
    const rectangleShape = fixture.editor.library.shapes.shape('Rectangle');
    await fixture.events.click(rectangleShape);

    // Get the element wrapper and see that it has focus
    let wrapperEl;
    await waitFor(async () => {
      const elementId = await fixture.renderHook(() =>
        useStory(({ state }) => state.currentPage.elements[1].id)
      );
      wrapperEl = getCanvasElementWrapperById(elementId);

      if (!wrapperEl) {
        throw new Error('element has not rendered to screen');
      }

      // There's some sort of debaounced timeout that we need to wait for before
      // frame elements receive focus after adding the element through the library
      if (document.activeElement !== wrapperEl) {
        throw new Error(
          'frame element wrapper has not recieved focus since adding new element'
        );
      }
    });
    expect(document.activeElement).toBe(wrapperEl);

    // Use Keyboard to navigate into the floating menu
    const designMenu = fixture.editor.canvas.designMenu;
    await fixture.events.keyboard.shortcut('control+alt+p');
    expect(designMenu._node.contains(document.activeElement)).toBe(true);

    // Use keyboard to navigate out of design menu
    await fixture.events.keyboard.press('Esc');
    expect(document.activeElement).toBe(wrapperEl);
  });
});
