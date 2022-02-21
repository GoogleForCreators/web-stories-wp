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

describe('Clone element integration', () => {
  let fixture;
  let bg, bgRect;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    bg = await getElementByIndex(1);
    bgRect = (await getCanvasElementWrapperById(bg.id)).getBoundingClientRect();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should correctly do nothing if no selection', async () => {
    // Switch to shapes tab and add a triangle
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));
    // Clear selection by pressing above background element
    await clickAboveElement(bg.id);

    // Press clone shortcut
    await fixture.events.keyboard.shortcut('mod+d');

    // Expect nothing to have changed
    expect(await getNumElements()).toBe(2);
  });

  it('should correctly do nothing if background is selected', async () => {
    // Switch to shapes tab and add a triangle
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));
    // Select background
    await clickElement(bg.id);

    // Press clone shortcut
    await fixture.events.keyboard.shortcut('mod+d');

    // Expect nothing to have changed
    expect(await getNumElements()).toBe(2);
  });

  it('should correctly clone 1 element', async () => {
    // Switch to shapes tab and add a triangle
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    // Select background to clear element selection.
    await clickElement(bg.id);

    // Select the added shape.
    const shape = await getElementByIndex(2);
    await clickElement(shape.id);

    // Press clone shortcut
    await fixture.events.keyboard.shortcut('mod+d');
    // Expect a new image to have been added
    expect(await getNumElements()).toBe(3);

    // Verify new element is in fact a clone and in correct position
    const clonedShape = await getElementByIndex(3);
    expect(clonedShape).toEqual(
      jasmine.objectContaining({
        mask: {
          type: 'rectangle',
        },
        x: shape.x + 30,
        y: shape.y + 30,
      })
    );
  });

  it('should correctly clone 2 elements', async () => {
    // Add first image to page
    let mediaItem = await getMediaElement(/blue-marble/);
    await fixture.events.mouse.clickOn(mediaItem, 20, 20);
    let img1 = await getElementByIndex(2);
    // Drag it to (50,50)
    const rect1 = (
      await getCanvasElementWrapperById(img1.id)
    ).getBoundingClientRect();
    await fixture.events.mouse.seq(({ move, down, up }) => [
      move(rect1.left + 10, rect1.top + 10),
      down(),
      move(bgRect.left + 50, bgRect.top + 50, { steps: 2 }),
      up(),
    ]);

    // Save final objects
    img1 = await getElementByIndex(2);
    // Add second image to page
    mediaItem = await getMediaElement(/saturn/);
    await fixture.events.mouse.clickOn(mediaItem, 20, 20);
    let img2 = await getElementByIndex(3);

    // Drag it to (100,100)
    const rect2 = (
      await getCanvasElementWrapperById(img2.id)
    ).getBoundingClientRect();
    await fixture.events.mouse.seq(({ move, down, up }) => [
      move(rect2.left + 10, rect2.top + 10),
      down(),
      move(bgRect.left + 100, bgRect.top + 100, { steps: 2 }),
      up(),
    ]);
    img2 = await getElementByIndex(3);

    // Select img1 and img2.
    await clickElement(img1.id);
    await clickElement(img2.id, /* isMultiSelect */ true);

    // Press clone shortcut
    await fixture.events.keyboard.shortcut('mod+d');

    // Expect two new images to have been added
    expect(await getNumElements()).toBe(5);

    // Verify new elements are in fact clones and in correct positions
    const clonedImg1 = await getElementByIndex(3);
    expect(clonedImg1).toEqual(
      jasmine.objectContaining({
        resource: jasmine.objectContaining({
          src: img1.resource.src,
        }),
        x: img1.x + 30,
        y: img1.y + 30,
      })
    );
    const clonedImg2 = await getElementByIndex(5);
    expect(clonedImg2).toEqual(
      jasmine.objectContaining({
        resource: jasmine.objectContaining({
          src: img2.resource.src,
        }),
        x: img2.x + 30,
        y: img2.y + 30,
      })
    );
  });

  // High-level helpers
  async function getNumElements() {
    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    return elements.length;
  }
  async function getElementByIndex(index) {
    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    return elements[index - 1];
  }
  async function clickElement(elementId, isMultiSelect = false) {
    const wrapper = await getCanvasElementWrapperById(elementId);
    const rect = wrapper.getBoundingClientRect();
    if (isMultiSelect) {
      // hold shift
      await fixture.events.keyboard.down('shift');
    }
    await fixture.events.mouse.click(rect.left + 10, rect.top + 10);
    if (isMultiSelect) {
      // release shift
      await fixture.events.keyboard.up('shift');
    }
  }
  async function clickAboveElement(elementId) {
    const wrapper = await getCanvasElementWrapperById(elementId);
    const rect = wrapper.getBoundingClientRect();
    await fixture.events.mouse.click(rect.left, rect.top - 10);
  }

  // Low-level helpers
  function getElementByQueryAndMatcher(tagName, matcher) {
    return Array.from(fixture.querySelectorAll(tagName)).find(matcher);
  }

  function getByAttribute(attr, value) {
    return (el) =>
      typeof value === 'string'
        ? el.getAttribute(attr) === value
        : value.test(el.getAttribute(attr));
  }

  function getMediaElement(imageAlt) {
    return getElementByQueryAndMatcher(
      '[data-testid^="mediaElement"] img',
      getByAttribute('alt', imageAlt)
    );
  }

  function getCanvasElementWrapperById(id) {
    return fixture.querySelector(
      `[data-testid="safezone"] [data-element-id="${id}"]`
    );
  }
});
