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
import { useInsertElement } from '..';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';

describe('Canvas keys integration', () => {
  let fixture;
  let element1;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    const insertElement = await fixture.renderHook(() => useInsertElement());
    element1 = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: `Page 1`,
        x: 40,
        y: 40,
        width: 250,
      })
    );

    await fixture.editor.canvas.framesLayer.waitFocusedWithin();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  async function getLatestElement(elementId) {
    const storyContext = await fixture.renderHook(() => useStory());
    const elements = storyContext.state.currentPage.elements;
    return elements.find(({ id }) => id === elementId);
  }

  async function getNonBackgroundElementIds() {
    const storyContext = await fixture.renderHook(() => useStory());
    const elements = storyContext.state.currentPage.elements;
    const nonBackgroundElements = elements.filter(
      ({ isBackground }) => !isBackground
    );
    return nonBackgroundElements.map(({ id }) => id);
  }

  it('should select the inserted element by default', async () => {
    expect(await getNonBackgroundElementIds()).toEqual([element1.id]);
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should delete the selected element', async () => {
    await fixture.events.keyboard.press('Del');
    expect(await getNonBackgroundElementIds()).toEqual([]);
    expect(await getSelection()).toEqual([]);
  });

  it('should delete element from the design panel', async () => {
    const firstToggle = fixture.querySelector(
      '#inspector-tab-design input[type="checkbox"]'
    );
    await fixture.events.focus(firstToggle);
    expect(await getSelection()).toEqual([element1.id]);

    await fixture.events.keyboard.press('Del');
    expect(await getNonBackgroundElementIds()).toEqual([]);
    expect(await getSelection()).toEqual([]);
  });

  it('should delete element from the tabs', async () => {
    const textTab = fixture.querySelector('#library-tab-text');
    await fixture.events.focus(textTab);
    expect(await getSelection()).toEqual([element1.id]);

    await fixture.events.keyboard.press('Del');
    expect(await getNonBackgroundElementIds()).toEqual([]);
    expect(await getSelection()).toEqual([]);
  });

  it('should not be able to delete element from a dialog', async () => {
    const colorButton = fixture.querySelector(
      'button[aria-label="Text color"]'
    );
    await fixture.events.click(colorButton);
    expect(await getSelection()).toEqual([element1.id]);

    await fixture.snapshot('color picker open');

    await fixture.events.keyboard.press('Del');
    expect(await getNonBackgroundElementIds()).toEqual([element1.id]);
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should move selection with arrow keys', async () => {
    await fixture.events.keyboard.press('left');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x - 10);

    await fixture.events.keyboard.press('right');
    await fixture.events.keyboard.press('right');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x + 10);

    await fixture.events.keyboard.press('up');
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y - 10);

    await fixture.events.keyboard.press('down');
    await fixture.events.keyboard.press('down');
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y + 10);
  });

  it('should move selection with arrow keys and fine step', async () => {
    await fixture.events.keyboard.shortcut('shift+left');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x - 1);

    await fixture.events.keyboard.shortcut('shift+right');
    await fixture.events.keyboard.shortcut('shift+right');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x + 1);

    await fixture.events.keyboard.shortcut('shift+up');
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y - 1);

    await fixture.events.keyboard.shortcut('shift+down');
    await fixture.events.keyboard.shortcut('shift+down');
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y + 1);
  });

  it('should not bubble up arrow keys from library tabs', async () => {
    const textTab = fixture.querySelector('#library-tab-text');
    await fixture.events.focus(textTab);

    await fixture.events.keyboard.press('right');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x);
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y);

    await fixture.events.keyboard.press('left');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x);
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y);

    await fixture.events.keyboard.press('up');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x);
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y);

    await fixture.events.keyboard.press('down');
    expect((await getLatestElement(element1.id)).x).toEqual(element1.x);
    expect((await getLatestElement(element1.id)).y).toEqual(element1.y);
  });
});
