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

describe('Canvas - keyboard navigation', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should not focus the canvas while tabbing through the editor', async () => {
    const focusContainer = fixture.screen.getByTestId('canvas-focus-container');

    // start focused on media pane searchbar
    await fixture.events.focus(fixture.editor.library.media.searchBar);

    // tab until focus reaches the canvas container
    let count = 0;
    while (count < 50) {
      // eslint-disable-next-line no-await-in-loop -- need to await key press
      await fixture.events.keyboard.press('tab');

      if (document.activeElement === focusContainer) {
        break;
      }

      count++;
    }

    if (count >= 50) {
      throw new Error('Could not find focus container.');
    }

    // tab once more
    await fixture.events.keyboard.press('tab');

    // verify that prev page button is focused
    expect(document.activeElement).toBe(
      fixture.editor.canvas.framesLayer.prevPage
    );
  });

  it('should focus the canvas and elements in the canvas after entering into the canvas space', async () => {
    // add some elements
    // add text to canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    // add shape to canvas
    await fixture.editor.library.shapesTab.click();
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));
    // add image to canvas
    await fixture.editor.library.mediaTab.click();
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );

    // start focused on media pane searchbar
    const focusContainer = fixture.screen.getByTestId('canvas-focus-container');

    // start focused on media pane searchbar
    await fixture.events.focus(fixture.editor.library.media.searchBar);

    // tab until focus reaches the canvas container
    let count = 0;
    while (count < 50) {
      // eslint-disable-next-line no-await-in-loop -- need to await key press
      await fixture.events.keyboard.press('tab');

      if (document.activeElement === focusContainer) {
        break;
      }

      count++;
    }

    if (count >= 50) {
      throw new Error('Could not find focus container.');
    }
    // enter into the canvas
    await fixture.events.keyboard.press('Enter');

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());

    const backgroundElement = elements.find((element) => element.isBackground);

    expect(document.activeElement.getAttribute('data-element-id')).toBe(
      backgroundElement.id
    );
    // verify cyclicity
    await fixture.events.keyboard.press('tab');
    // TODO: check selected elements instead https://github.com/GoogleForCreators/web-stories-wp/issues/11000
    expect(document.activeElement.getAttribute('data-element-id')).not.toBe(
      backgroundElement.id
    );
    // tab through each added element
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    // should be back to first added element
    expect(document.activeElement.getAttribute('data-element-id')).toBe(
      backgroundElement.id
    );
    // exit canvas
    await fixture.events.keyboard.press('Escape');
    // verify exit
    expect(document.activeElement).toBe(focusContainer);
  });
});
