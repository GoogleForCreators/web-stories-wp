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

describe('Background Copy Paste integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    await addNewPage();

    await waitFor(() => {
      if (fixture.editor.footer.carousel.pages.length === 0) {
        throw new Error('Carousel pages not loaded yet');
      }
    });
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should correctly copy pattern background to page with pattern background', async () => {
    // Arrange the backgrounds
    await gotoPage(1);
    await setBackgroundColor('FF0000');
    await gotoPage(2);
    await setBackgroundColor('00FF00');

    // Verify setup - 1 element on each page in the right color
    await gotoPage(1);
    await waitFor(() => {
      const pageArea = getPageArea();
      if (!pageArea) {
        throw new Error('node not ready!');
      }
      expect(getPageArea()).toHaveStyle('background-color', 'rgb(255, 0, 0)');
    });
    expect(await getNumElements()).toBe(1);
    await gotoPage(2);
    await waitFor(() => {
      const pageArea = getPageArea();
      if (!pageArea) {
        throw new Error('node not ready!');
      }
      expect(getPageArea()).toHaveStyle('background-color', 'rgb(0, 255, 0)');
    });
    expect(await getNumElements()).toBe(1);

    // Act: Copy background from page 1 to page 2
    await gotoPage(1);
    await clickBackgroundElement();
    await fixture.events.clipboard.copy();
    await gotoPage(2);
    await fixture.events.clipboard.paste();

    // Assert - validate that page 2 now has the correct background color and only 1 element
    await gotoPage(2);
    await waitFor(() => {
      const pageArea = getPageArea();
      if (!pageArea) {
        throw new Error('node not ready!');
      }
      expect(getPageArea()).toHaveStyle('background-color', 'rgb(255, 0, 0)');
    });
    expect(await getNumElements()).toBe(1);
  });

  it('should correctly copy pattern background to page with image', async () => {
    // Arrange the backgrounds
    await gotoPage(1);
    await setBackgroundColor('FF0000');
    await gotoPage(2);
    await setBackgroundColor('00FF00');
    await addBackgroundImage(0);

    // Verify setup - 1 element on each page
    await gotoPage(1);
    expect(await getPageArea()).toHaveStyle(
      'background-color',
      'rgb(255, 0, 0)'
    );
    expect(await getNumElements()).toBe(1);
    await gotoPage(2);
    expect(await getCanvasBackgroundElement()).not.toBeEmpty();
    expect(await getCanvasBackgroundImage()).toHaveProperty(
      'src',
      /blue-marble/
    );
    expect(await getNumElements()).toBe(1);

    // Act: Copy background from page 1 to page 2
    await gotoPage(1);
    await clickBackgroundElement();
    await fixture.events.clipboard.copy();
    await gotoPage(2);
    await fixture.events.clipboard.paste();

    // Assert - validate that page 2 now has the correct background color, no image and only 1 element
    await gotoPage(2);
    expect(await getPageArea()).toHaveStyle(
      'background-color',
      'rgb(255, 0, 0)'
    );
    expect(await getCanvasBackgroundElement()).toBeEmpty();
    expect(await getNumElements()).toBe(1);
  });

  it('should correctly copy image to page without image', async () => {
    // Arrange the backgrounds
    await gotoPage(1);
    await setBackgroundColor('FF0000');
    await addBackgroundImage(0);
    await gotoPage(2);
    await setBackgroundColor('00FF00');

    // Verify setup - 1 element on each page
    await gotoPage(1);
    expect(await getCanvasBackgroundElement()).not.toBeEmpty();
    expect(await getCanvasBackgroundImage()).toHaveProperty(
      'src',
      /blue-marble/
    );
    expect(await getNumElements()).toBe(1);
    await gotoPage(2);
    expect(await getPageArea()).toHaveStyle(
      'background-color',
      'rgb(0, 255, 0)'
    );
    expect(await getNumElements()).toBe(1);

    // Act: Copy background from page 1 to page 2
    await gotoPage(1);
    await clickBackgroundElement();
    await fixture.events.clipboard.copy();
    await gotoPage(2);
    await fixture.events.clipboard.paste();

    // Assert - validate that page 2 now has the correct image and only 1 element
    await gotoPage(2);
    expect(await getCanvasBackgroundElement()).not.toBeEmpty();
    expect(await getNumElements()).toBe(1);

    // Now delete background image and verify that underlying color is still correct
    await clickBackgroundElement();
    await fixture.events.keyboard.press('del');
    expect(await getPageArea()).toHaveStyle(
      'background-color',
      'rgb(0, 255, 0)'
    );
    expect(await getCanvasBackgroundElement()).toBeEmpty();
  });

  it('should correctly copy image to page with existing image', async () => {
    // Arrange the backgrounds
    await gotoPage(1);
    await setBackgroundColor('FF0000');
    await addBackgroundImage(0);
    await fixture.events.sleep(100);
    await fixture.events.click(fixture.editor.inspector.designTab);
    await fixture.events.click(
      fixture.editor.inspector.designPanel.filters.linear
    );
    await gotoPage(2);
    await setBackgroundColor('00FF00');
    await addBackgroundImage(1);
    await fixture.events.sleep(100);
    await fixture.events.click(fixture.editor.inspector.designTab);
    await fixture.events.click(
      fixture.editor.inspector.designPanel.filters.radial
    );

    // Verify setup - 1 image on each page with correct overlay
    await gotoPage(1);
    expect(await getCanvasBackgroundImage()).toHaveProperty(
      'src',
      /blue-marble/
    );
    expect(await getCanvasBackgroundOverlay()).toHaveStyle(
      'background-image',
      'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
    );
    expect(await getNumElements()).toBe(1);
    await gotoPage(2);
    expect(await getCanvasBackgroundImage()).toHaveProperty('src', /curiosity/);
    expect(await getCanvasBackgroundOverlay()).toHaveStyle(
      'background-image',
      'radial-gradient(67% 67%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
    );
    expect(await getNumElements()).toBe(1);

    // Act: Copy background from page 1 to page 2
    await gotoPage(1);
    await clickBackgroundElement();
    await fixture.events.clipboard.copy();
    await gotoPage(2);
    await fixture.events.clipboard.paste();

    // Assert - validate that page 2 now has the correct image and overlay and only 1 element
    await gotoPage(2);
    expect(await getCanvasBackgroundImage()).toHaveProperty(
      'src',
      /blue-marble/
    );
    expect(await getCanvasBackgroundOverlay()).toHaveStyle(
      'background-image',
      'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
    );
    await fixture.events.sleep(10000);
    expect(await getNumElements()).toBe(1);

    // Now delete background image and verify that underlying color is still correct
    await clickBackgroundElement();
    await fixture.events.keyboard.press('del');
    expect(await getPageArea()).toHaveStyle(
      'background-color',
      'rgb(0, 255, 0)'
    );
    expect(await getCanvasBackgroundElement()).toBeEmpty();
  });

  // High-level helpers
  async function addNewPage() {
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
  }
  async function gotoPage(index /* 1-indexed */) {
    const pageAtIndex = fixture.editor.footer.carousel.pages[index - 1].node;
    await fixture.events.click(pageAtIndex);
  }
  async function setBackgroundColor(hex) {
    await clickBackgroundElement();
    await fixture.events.click(fixture.editor.inspector.designTab);
    const hexInput = getInputByAriaLabel('Background color');
    // First click the input field to focus it
    await fixture.events.click(hexInput);
    // Select all the text
    hexInput.select();
    // Then type hex combo
    await fixture.events.keyboard.type(hex);
    await fixture.events.keyboard.press('tab');
  }
  async function addBackgroundImage(index) {
    // Add image and click "set as background"
    await fixture.events.click(fixture.editor.inspector.insertTab);
    await fixture.events.click(fixture.editor.library.mediaTab);
    const image = fixture.editor.library.media.item(index);
    await fixture.events.mouse.clickOn(image, 20, 20);
    await fixture.events.click(fixture.editor.inspector.designTab);
    await fixture.events.click(
      fixture.editor.inspector.designPanel.sizePosition.setAsBackground
    );
  }
  async function getNumElements() {
    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    return elements.length;
  }
  async function getCanvasBackgroundElement() {
    const wrapper = await getCanvasBackgroundElementWrapper();
    // TODO fix this selector
    return wrapper.querySelector('[class^="display__Element-"]');
  }
  async function getCanvasBackgroundOverlay() {
    const wrapper = await getCanvasBackgroundElementWrapper();
    // TODO fix this selector
    return wrapper.querySelector(
      '[class^="displayElement__BackgroundOverlay-"]'
    );
  }
  async function getCanvasBackgroundImage() {
    const wrapper = await getCanvasBackgroundElementWrapper();
    // TODO fix this selector
    return wrapper.querySelector('img');
  }
  async function clickBackgroundElement() {
    const bg = await getCanvasBackgroundElementFrame();
    await fixture.events.click(bg);
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

  function getInputByAriaLabel(ariaLabel) {
    return getElementByQueryAndMatcher(
      'input',
      getByAttribute('aria-label', ariaLabel)
    );
  }

  function getCanvasElementWrapperById(id) {
    return fixture.querySelector(
      `[data-testid="safezone"] [data-element-id="${id}"]`
    );
  }

  function getCanvasElementFrameById(id) {
    return fixture.querySelector(
      `[data-testid="FramesLayer"] [data-element-id="${id}"]`
    );
  }

  async function getBackgroundElementId() {
    const {
      state: {
        currentPage: {
          elements: [{ id }],
        },
      },
    } = await fixture.renderHook(() => useStory());
    return id;
  }

  async function getCanvasBackgroundElementWrapper() {
    const id = await getBackgroundElementId();
    return getCanvasElementWrapperById(id);
  }

  async function getCanvasBackgroundElementFrame() {
    const id = await getBackgroundElementId();
    return getCanvasElementFrameById(id);
  }

  function getPageArea() {
    return fixture.querySelector('[data-testid="fullbleed"]');
  }
});
