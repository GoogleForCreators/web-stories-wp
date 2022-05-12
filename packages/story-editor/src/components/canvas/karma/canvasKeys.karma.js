/*
 * Copyright 2020 Google LLC
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

describe('Canvas Keyboard Shortcuts', () => {
  let fixture;
  let elementIds;

  async function insertMediaByIndex(index) {
    const mediaItem = fixture.editor.library.media.item(index);
    await fixture.events.mouse.clickOn(mediaItem, 20, 20);
  }

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    // Let's insert three images
    await insertMediaByIndex(0);
    await insertMediaByIndex(1);
    await insertMediaByIndex(2);

    // And let's get the ID's of those three elements for easy access later
    const storyContext = await fixture.renderHook(() => useStory());
    elementIds = storyContext.state.currentPage.elements
      .slice(1)
      .map(({ id }) => id);
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  it('should have the last element selected by default', async () => {
    expect(await getSelection()).toEqual([elementIds[2]]);
  });

  it('should select all elements when pressing mod+a shortcut', async () => {
    await fixture.events.focus(fixture.editor.canvas.framesLayer.fullbleed);
    await fixture.events.keyboard.shortcut('mod+a');
    expect(await getSelection()).toEqual([...elementIds]);
  });

  it('should focus on the design panel link input when pressing mod+k shortcut', async () => {
    const TEST_URL = 'https://test.com';

    // select any or all elements on the page
    await fixture.events.focus(fixture.editor.canvas.framesLayer.fullbleed);
    await fixture.events.keyboard.shortcut('mod+a');

    // press mod+k
    await fixture.events.keyboard.shortcut('mod+k');

    // expect to focus on design panel link input
    expect(fixture.editor.sidebar.designPanel.link).not.toBeNull();

    expect(document.activeElement).toEqual(
      fixture.editor.sidebar.designPanel.link.address
    );

    // add url to the selectedElements
    await fixture.events.keyboard.type(TEST_URL);
    await fixture.events.keyboard.press('Enter');

    // check that all the elements selected have the url
    const { selectedElements } = await fixture.renderHook(() =>
      useStory(({ state: selectedElements }) => selectedElements)
    );

    for (const element of selectedElements) {
      expect(element.link.url).toBe(TEST_URL);
    }
  });

  it('should play pause animation when pressing mod+space shortcut', async () => {
    // add a second page to allow for animations
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);

    // insert element
    await insertMediaByIndex(0);

    // add a long animation to the element
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );
    const effectChooser =
      fixture.editor.sidebar.designPanel.animation.effectChooser;
    await fixture.events.click(effectChooser, { clickCount: 1 });
    await fixture.events.click(
      fixture.screen.getByRole('option', { name: /^"Fade In" Effect$/ })
    );
    // click to close
    await fixture.events.click(effectChooser, { clickCount: 1 });
    const duration = fixture.screen.getByLabelText('Duration');
    await fixture.events.click(duration);
    await fixture.events.keyboard.type('1000');
    await fixture.events.keyboard.press('Enter');

    // wait for initial animation
    await fixture.events.sleep(1000);

    // select the canvas
    await fixture.events.click(
      fixture.editor.canvas.framesLayer.frames[0].node
    );

    // check that 'Play Animation' toggle button is there
    let toggle = fixture.screen.getByLabelText('Play Page Animations');
    expect(toggle).toBeDefined();

    // press mod+space
    await fixture.events.keyboard.shortcut('mod+space');

    // check that 'Stop Animation' toggle button is there
    toggle = fixture.screen.getByLabelText('Stop Page Animations');
    expect(toggle).toBeDefined();

    // press mod+space
    await fixture.events.keyboard.shortcut('mod+space');

    // check that 'Play Animation' toggle button is there
    toggle = fixture.screen.getByLabelText('Play Page Animations');
    expect(toggle).toBeDefined();
  });
});
