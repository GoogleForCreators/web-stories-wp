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
import { waitFor } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';
import { tabToCanvasFocusContainer } from '../../karma/utils';

function isStoryEmpty() {
  if (document.getElementById('emptystate-message')) {
    return true;
  }
  return false;
}

describe('Shopping integration', () => {
  let fixture;

  async function focusProductSearchInput() {
    await fixture.editor.library.shoppingTab.click();
    await fixture.events.keyboard.press('tab');
    const searchInput = fixture.querySelector('[aria-label="Product search"]');
    await fixture.events.focus(searchInput);
    await fixture.events.click(searchInput);
  }

  async function insertProduct(product) {
    await focusProductSearchInput();
    await fixture.events.keyboard.type(product);
    const productButton = fixture.querySelector(
      `[aria-label="Add ${product}"]`
    );
    await fixture.events.click(productButton);
    await waitFor(() =>
      fixture.querySelector('[aria-label="Design menu"] [aria-label="Product"]')
    );
  }

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ shoppingIntegration: true });
    fixture.setFlags({ floatingMenu: true });
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelectedElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0];
  };

  fdescribe('Shopping tab', () => {
    it('should handle product search add and remove', async () => {
      const productTitle = 'Hoodie with Zipper';
      await focusProductSearchInput();
      expect(isStoryEmpty()).toEqual(true);
      await fixture.events.keyboard.type('hood');
      // delay for search to catch-up
      await fixture.events.sleep(400);

      const productButton = fixture.querySelector(
        `[aria-label="Add ${productTitle}"]`
      );
      await fixture.events.click(productButton);
      await waitFor(() =>
        fixture.querySelector(
          '[aria-label="Design menu"] [aria-label="Product"]'
        )
      );

      // check story `state`
      const selectedElement = await getSelectedElement();
      expect(isStoryEmpty()).toEqual(false);
      await expect(selectedElement?.product?.productTitle).toBe(productTitle);
      await focusProductSearchInput();

      // select the product add / remove button
      const product = fixture.querySelector(
        `[aria-label="Remove ${productTitle}"]`
      );

      // check add / remove icons
      const checkIcon = fixture.querySelector(
        `[aria-label="Remove ${productTitle}"] .check`
      );
      const removeIcon = fixture.querySelector(
        `[aria-label="Remove ${productTitle}"] .remove`
      );
      expect(window.getComputedStyle(checkIcon).display).toBe('block');
      expect(window.getComputedStyle(removeIcon).display).toBe('none');
      await fixture.events.hover(product);
      expect(window.getComputedStyle(checkIcon).display).toBe('none');
      expect(window.getComputedStyle(removeIcon).display).toBe('block');

      // remove the product
      await fixture.events.mouse.clickOn(product, 1, 1);
      expect(isStoryEmpty()).toEqual(true);
    });
  });

  describe('Product floating menu', () => {
    it('should render products menu', async () => {
      const productTitle = 'Album';
      await insertProduct(productTitle);
      const selectedElement = await getSelectedElement();
      await expect(selectedElement?.product?.productTitle).toBe(productTitle);
    });

    it('should update selected product via floating menu', async () => {
      const productTitle = 'Beanie with Logo';
      const newProductTitle = 'Single';
      await insertProduct(productTitle);
      await getSelectedElement();
      const productSelector = fixture.querySelector(
        '[aria-label="Design menu"] [aria-label="Product"]'
      );
      await fixture.events.mouse.clickOn(productSelector, 1, 1);
      await fixture.events.keyboard.type(newProductTitle);
      await fixture.events.keyboard.press('ArrowDown');
      await fixture.events.keyboard.press('Enter');
      const selectedElement = await getSelectedElement();
      await expect(selectedElement?.product?.productTitle).toBe(
        newProductTitle
      );
    });

    it('should show floating menu when product is selected on canvas', async () => {
      const productTitle = 'Single';
      await insertProduct(productTitle);
      const focusContainer = fixture.screen.getByTestId(
        'canvas-focus-container'
      );

      // deselect the product
      await fixture.events.click(focusContainer);
      const canvasElement = await getSelectedElement();
      await expect(canvasElement.isBackground).toBe(true);

      // reselect the product
      await tabToCanvasFocusContainer(focusContainer, fixture);
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('Tab');
      const selectedElement = await getSelectedElement();
      await expect(selectedElement?.product?.productTitle).toBe(productTitle);
    });
  });
});
