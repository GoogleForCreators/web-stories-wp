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

const stickerTestType = Object.keys(STICKERS)[0];

describe('Canvas - keyboard navigation', () => {
  let fixture;
  let focusContainer;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

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

  it('should not focus the canvas while tabbing through the editor', async () => {
    await tabToCanvasFocusContainer();

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

    await tabToCanvasFocusContainer();

    // enter into the canvas
    await fixture.events.keyboard.press('Enter');

    const selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );

    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].isBackground).toBe(true);
    expect(document.activeElement.getAttribute('data-element-id')).toBe(
      selectedElements[0].id
    );

    // exit canvas
    await fixture.events.keyboard.press('Escape');

    // verify exit
    expect(document.activeElement).toBe(focusContainer);
  });

  it('should change element selection on focus and wrap around at the last element', async () => {
    // add one of each element
    // add text to canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    // add shape to canvas
    await fixture.editor.library.shapesTab.click();
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));
    // add sticker to canvas
    await fixture.events.click(
      fixture.editor.library.shapes.sticker(stickerTestType)
    );
    // add image to canvas
    await fixture.editor.library.mediaTab.click();
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );

    await tabToCanvasFocusContainer();

    // enter into the canvas
    await fixture.events.keyboard.press('Enter');

    let selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].isBackground).toBe(true);

    // tab to the text element
    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].type).toBe('text');

    // tab to the shape element
    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].type).toBe('shape');

    // tab to the sticker element
    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].type).toBe('sticker');

    // tab to the image element
    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].type).toBe('image');

    // verify ciclicity: wrap around to background element
    await fixture.events.keyboard.press('Tab');

    selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].isBackground).toBe(true);
  });
});
