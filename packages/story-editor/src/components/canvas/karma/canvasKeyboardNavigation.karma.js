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

  // eslint-disable-next-line jasmine/no-disabled-tests -- not implemented yet
  xit('should focus the canvas and elements in the canvas after entering into the canvas space', async () => {
    // start focused on media pane searchbar
    // tab until focus reaches the canvas container
    // enter into the canvas
    // verify cyclicity
    // exit canvas
    // verify exit
  });
});
