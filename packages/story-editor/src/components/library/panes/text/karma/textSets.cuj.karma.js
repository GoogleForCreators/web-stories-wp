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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('CUJ: Text Sets (Text and Shape Combinations): Using Text Sets', () => {
  let fixture;
  let originalTimeout;

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    fixture = new Fixture();
    await fixture.render();
    await fixture.editor.library.textTab.click();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    fixture.restore();
  });

  it('should display text sets', async () => {
    await waitFor(
      () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
      { timeout: 2000 }
    );
  });

  it('should allow inserting text sets', async () => {
    await waitFor(
      () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
      { timeout: 2000 }
    );
    const textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[1]);

    // Wait for text set to be inserted
    await waitFor(() => fixture.editor.canvas.framesLayer.frames[2].node);

    // Text sets contain at least 2 elements.
    expect((await getSelection()).length).toBeGreaterThan(1);
  });

  it('should allow inserting text set by keyboard', async () => {
    await waitFor(
      () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
      { timeout: 2000 }
    );
    const textSets = fixture.editor.library.text.textSets;

    await fixture.events.focus(textSets[0]);

    await fixture.events.keyboard.press('down');

    const activeTextSetId = textSets[2].getAttribute('data-testid');
    const documentTestId = document.activeElement.getAttribute('data-testid');

    expect(activeTextSetId).toBe(documentTestId);
    await fixture.events.keyboard.press('Enter');

    // Wait for text set to be inserted
    await waitFor(() => fixture.editor.canvas.framesLayer.frames[2].node);

    // Text sets contain at least 2 elements.
    expect((await getSelection()).length).toBeGreaterThan(1);
  });

  it('should allow user to drag and drop text set onto page', async () => {
    await waitFor(
      () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
      { timeout: 2000 }
    );

    const textSet = fixture.editor.library.text.textSets[1];
    const page = fixture.editor.canvas.framesLayer.fullbleed;

    textSet.scrollIntoView();
    await fixture.events.mouse.moveRel(textSet, 25, 25);
    await fixture.events.mouse.down();
    await fixture.events.mouse.moveRel(page, 50, 100, { steps: 20 });
    await fixture.snapshot('Text set dragged');
    await fixture.events.mouse.up();

    await fixture.renderHook(() => useStory());

    // After text set has been added, there should some text elements
    await fixture.snapshot('Text set added');
    expect((await getSelection()).length).toBeGreaterThan(1);
  });

  it('should allow filtering text sets by category', async () => {
    await waitFor(() =>
      expect(
        fixture.editor.library.text.textSetFilter('Editorial')
      ).toBeTruthy()
    );
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Editorial')
    );
    expect(fixture.editor.library.text.textSets.length).toBe(15);
  });

  it('should position the text sets as expected by category', async () => {
    await waitFor(
      () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
      { timeout: 2000 }
    );

    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Editorial')
    );
    let textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[0]);
    await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
    await fixture.snapshot('Editorial text set positioning');

    await fixture.events.click(fixture.editor.canvas.framesLayer.addPage);
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Header')
    );
    textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[0]);
    await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
    await fixture.snapshot('List text set positioning');

    await fixture.events.click(fixture.editor.canvas.framesLayer.addPage);
    await fixture.events.click(
      fixture.editor.library.text.textSetFilter('Steps')
    );
    textSets = fixture.editor.library.text.textSets;
    await fixture.events.click(textSets[0]);
    await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
    await fixture.snapshot('Steps text set positioning');
  });

  describe('Easier/smarter text set color', () => {
    it('should add text color based on background', async () => {
      fixture.editor.library.text.smartColorToggle.click();

      await fixture.events.click(fixture.screen.getByTestId('FramesLayer'));
      await fixture.events.click(
        fixture.editor.inspector.designPanel.pageBackground.backgroundColorInput
      );
      await fixture.events.keyboard.type('000');
      await fixture.events.keyboard.press('Tab');

      await waitFor(
        () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
        { timeout: 2000 }
      );
      const textSets = fixture.editor.library.text.textSets;
      // First hover text set to trigger image generation
      await fixture.events.mouse.moveRel(textSets[1], 10, 10);

      await fixture.events.sleep(800);
      // Then click the text set
      await fixture.events.click(textSets[1]);
      await waitFor(
        () =>
          expect(
            fixture.editor.canvas.framesLayer.frames[1].node
          ).toBeDefined(),
        { timeout: 5000 }
      );
      const selection = await getSelection();
      // Text color should be changed to white, since it's placed on a dark background.
      expect(selection[1].content).toEqual(
        '<span style="font-weight: 600; color: #fff; letter-spacing: 0.05em; text-transform: uppercase">Category</span>'
      );
    });
  });

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  }
});
