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

describe('Background Copy Paste integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    await addNewPage();
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
    expect(await getPageArea()).toHaveStyle(
      'background-color',
      'rgb(255, 0, 0)'
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

    // Assert - validate that page 2 now has the correct background color and only 1 element
    await gotoPage(2);
    expect(await getPageArea()).toHaveStyle(
      'background-color',
      'rgb(255, 0, 0)'
    );
    expect(await getNumElements()).toBe(1);
  });

  it('should correctly copy pattern background to page with image', async () => {
    // Arrange the backgrounds
    await gotoPage(1);
    await setBackgroundColor('FF0000');
    await gotoPage(2);
    await setBackgroundColor('00FF00');
    await addBackgroundImage('blue-marble');

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
    await addBackgroundImage('blue-marble');
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
    await addBackgroundImage('blue-marble');
    await setOverlay('linear');
    await gotoPage(2);
    await setBackgroundColor('00FF00');
    await addBackgroundImage('saturn');
    await setOverlay('radial');

    // Verify setup - 1 image on each page with correct overlay
    await gotoPage(1);
    expect(await getCanvasBackgroundImage()).toHaveProperty(
      'src',
      /blue-marble/
    );
    expect(await getCanvasBackgroundOverlay()).toHaveStyle(
      'background-image',
      'linear-gradient(rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.9) 100%)'
    );
    expect(await getNumElements()).toBe(1);
    await gotoPage(2);
    expect(await getCanvasBackgroundImage()).toHaveProperty('src', /saturn/);
    expect(await getCanvasBackgroundOverlay()).toHaveStyle(
      'background-image',
      'radial-gradient(80% 50%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.6) 100%)'
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
      'radial-gradient(80% 50%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.6) 100%)'
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
    const addPage = getButtonByAriaLabel(/Add new page/i);
    await fixture.events.click(addPage);
  }
  async function gotoPage(index /* 1-indexed */) {
    const carousel = getElementByQueryAndMatcher(
      'div[role="listbox"]',
      getByAttribute('aria-label', /Pages List/i)
    );
    const pageAtIndex = carousel.querySelectorAll('button[role="option"]')[
      index - 1
    ];
    await fixture.events.click(pageAtIndex);
  }
  async function setBackgroundColor(hex) {
    await clickBackgroundElement();
    const hexInput = getInputByAriaLabel('Background color');
    // First click the input field to focus it
    await fixture.events.click(hexInput);
    // Select all the text
    hexInput.select();
    // Then type hex combo
    await fixture.events.keyboard.type(hex);
    await fixture.events.keyboard.press('tab');
  }
  function setOverlay(overlayName) {
    const overlayCheckbox = getInputByAriaLabel(
      new RegExp(`set overlay: ${overlayName}`, 'i')
    );
    const overlayLabel = overlayCheckbox.parentNode;
    overlayLabel.click();
  }
  async function addBackgroundImage(imageAlt) {
    // Click img in library to add it to page
    const source = getMediaElement(imageAlt);
    await fixture.events.click(source);

    // Click "set as background"
    const setAsBackground = getButtonByText('Set as background');
    await fixture.events.click(setAsBackground);
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

  function getByInnerText(text) {
    return (el) =>
      typeof text === 'string'
        ? el.innerText === text
        : text.test(el.innerText);
  }

  function getByAttribute(attr, value) {
    return (el) =>
      typeof value === 'string'
        ? el.getAttribute(attr) === value
        : value.test(el.getAttribute(attr));
  }

  function getButtonByText(buttonText) {
    return getElementByQueryAndMatcher('button', getByInnerText(buttonText));
  }

  function getButtonByAriaLabel(ariaLabel) {
    return getElementByQueryAndMatcher(
      'button',
      getByAttribute('aria-label', ariaLabel)
    );
  }

  function getInputByAriaLabel(ariaLabel) {
    return getElementByQueryAndMatcher(
      'input',
      getByAttribute('aria-label', ariaLabel)
    );
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
    return fixture.querySelector(
      '[data-testid="fullbleed"] [class^="layout__PageAreaWithOverflow"]'
    );
  }
});
