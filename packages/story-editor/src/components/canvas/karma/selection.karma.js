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

describe('CUJ: Creator can Transform an Element: Selection integration', () => {
  let fixture;
  let fullbleed;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    fullbleed = fixture.container.querySelector('[data-testid="fullbleed"]');
  });

  afterEach(() => {
    fixture.restore();
  });

  async function clickOnTarget(target) {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
  }

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  async function setFontSize(size) {
    await fixture.events.click(fixture.editor.sidebar.designTab);
    const fontSize = fixture.editor.sidebar.designPanel.textStyle.fontSize;
    await fixture.events.click(fontSize, { clickCount: 3 });
    await fixture.events.keyboard.type(size);
    await fixture.events.keyboard.press('tab');
    // Give time for the font size to be applied.
    await fixture.events.sleep(100);
  }

  it('should have the last element selected by default', async () => {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      const node = fixture.editor.canvas.framesLayer.frames[1].node;
      if (!node) {
        throw new Error('node not ready');
      }
      expect(node).toBeTruthy();
    });
    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;
    expect(await getSelection()).toEqual([frame1.dataset.elementId]);
  });

  it('should allow selecting background through the empty area of a triangle', async () => {
    // Switch to shapes tab and click the triangle
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));
    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;
    expect(await getSelection()).toEqual([frame1.dataset.elementId]);

    // Click on the upper left corner of the triangle -- that's empty area.
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(frame1, 7, 7),
      down(),
      up(),
    ]);
    const bgFrame = fixture.editor.canvas.framesLayer.frames[0].node;
    expect(await getSelection()).toEqual([bgFrame.dataset.elementId]);
  });

  it('should show the selection lines when an element is being selected', async () => {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      const node = fixture.editor.canvas.framesLayer.frames[1].node;
      if (!node) {
        throw new Error('node not ready');
      }
      expect(node).toBeTruthy();
    });
    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;
    // De-select element by clicking somewhere else.
    const { x, y } = fullbleed.getBoundingClientRect();
    await fixture.events.mouse.click(x - 50, y);
    expect(await getSelection()).toEqual([]);
    // Select the element again.
    await clickOnTarget(frame1);
    expect(
      fixture.querySelector('.moveable-line.moveable-direction.moveable-n')
    ).toBeDefined();
    await fixture.snapshot('text element is selected');
  });

  it('should show the selection lines when out of page area', async () => {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      const node = fixture.editor.canvas.framesLayer.frames[1].node;
      if (!node) {
        throw new Error('node not ready');
      }
      expect(node).toBeTruthy();
    });
    await setFontSize('30');
    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;
    const resizeW = fixture
      .querySelector('.moveable-w')
      .getBoundingClientRect();
    await fixture.events.mouse.seq(({ move, moveBy, down, up }) => [
      move(resizeW.left + 1, resizeW.top + 1),
      down(),
      moveBy(-200, 0),
      up(),
    ]);

    expect(await getSelection()).toEqual([frame1.dataset.elementId]);
    await fixture.snapshot();
  });

  it('should show the selection on top of page navigation arrows', async () => {
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);

    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      const node = fixture.editor.canvas.framesLayer.frames[1].node;
      if (!node) {
        throw new Error('node not ready');
      }
      expect(node).toBeTruthy();
    });
    await setFontSize('30');

    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;

    const prevPage =
      fixture.editor.canvas.framesLayer.prevPage.getBoundingClientRect();
    const resizeW = fixture
      .querySelector('.moveable-w')
      .getBoundingClientRect();
    await fixture.events.mouse.seq(({ move, down, up }) => [
      move(resizeW.left + 1, resizeW.top + 1),
      down(),
      move(prevPage.left - prevPage.width / 2, 0),
      up(),
    ]);
    expect(await getSelection()).toEqual([frame1.dataset.elementId]);
    await fixture.snapshot('selection on top of the page nav');
  });

  it('should return focus to selection when pressing mod+alt+2', async () => {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      const node = fixture.editor.canvas.framesLayer.frames[1].node;
      if (!node) {
        throw new Error('node not ready');
      }
      expect(node).toBeTruthy();
    });
    // NB: We can't actually validate that the frame has focus, as that's a bit flaky,
    // But as long as the focus moves in the shortcut press, it's fair to assume that it has
    // Move to the canvas selection.

    // Click elsewhere
    await fixture.events.click(fixture.editor.canvas.header.title);
    expect(fixture.editor.canvas.header.title).toHaveFocus();

    // Return focus with shortcut
    await fixture.events.keyboard.shortcut('mod+alt+2');
    expect(fixture.editor.canvas.header.title).not.toHaveFocus();
    await fixture.snapshot('selected element has focus');
  });
});
