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

    fullbleed = fixture.container.querySelector('[data-testid="fullbleed"]');
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  async function setFontSize(size) {
    const fontSize = fixture.editor.inspector.designPanel.textStyle.fontSize;
    await fixture.events.click(fontSize, { clickCount: 3 });
    await fixture.events.keyboard.type(size);
    await fixture.events.keyboard.press('tab');
    // Give time for the font size to be applied.
    await fixture.events.sleep(100);
  }

  it('should have the last element selected by default', async () => {
    await fixture.events.click(fixture.editor.library.textAdd);
    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;
    expect(await getSelection()).toEqual([frame1.dataset.elementId]);
  });

  it('should show the selection lines when out of page area', async () => {
    await fixture.events.click(fixture.editor.library.textAdd);
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

  it('should show the selection on top of page menu', async () => {
    await fixture.events.click(fixture.editor.library.textAdd);
    await setFontSize('30');
    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;
    const fbcr = frame1.getBoundingClientRect();
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1, 15, 15),
      down(),
      moveBy(
        0,
        fullbleed.getBoundingClientRect().bottom -
          fbcr.bottom +
          fbcr.height -
          5,
        { steps: 5 }
      ),
      up(),
    ]);
    expect(await getSelection()).toEqual([frame1.dataset.elementId]);
    await fixture.snapshot('selection and page menu');
  });

  it('should show the selection on top of page navigation arrows', async () => {
    await fixture.events.click(fixture.editor.canvas.framesLayer.addPage);

    await fixture.events.click(fixture.editor.library.textAdd);
    await setFontSize('30');

    const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;

    const prevPage = fixture.editor.canvas.framesLayer.prevPage.getBoundingClientRect();
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
    await fixture.events.click(fixture.editor.library.textAdd);
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
