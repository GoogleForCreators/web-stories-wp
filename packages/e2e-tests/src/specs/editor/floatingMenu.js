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
import { createNewStory } from '@web-stories-wp/e2e-test-utils';

describe('Floating Menu', () => {
  const floatingMenu = 'section[data-testid="floating-menu"]';

  beforeEach(async () => {
    await createNewStory();
  });

  it('should display text floating menu', async () => {
    // Open a text tab
    await expect(page).toClick('#library-tab-text');

    // Add a paragraph
    await expect(page).toClick('button[data-testid="preview-text"] span', {
      text: /^Paragraph/,
    });

    // Floating menu should show up
    await page.waitForSelector(floatingMenu);
    await expect(page).toMatchElement(floatingMenu);
  });

  it('should display media floating menu', async () => {
    // Open a media tab
    await expect(page).toClick('#library-tab-media');

    // Add a media item
    await expect(page).toClick(
      'div[data-testid="mediaElement-image"]:first-child button'
    );

    const insertButton = await page.waitForXPath(
      `//li//span[contains(text(), 'Insert image')]`
    );
    await insertButton.click();

    // Floating menu should show up
    await page.waitForSelector(floatingMenu);
    await expect(page).toMatchElement(floatingMenu);
  });

  it('should display media3p floating menu', async () => {
    // Open a media3p tab
    const media3pSelector = '#library-tab-media3p';

    await expect(page).toMatchElement(media3pSelector);
    await expect(page).toClick(media3pSelector);

    await expect(page).toMatchElement('button', { text: 'Image' });
    await expect(page).toClick('button', { text: 'Image' });

    await page.waitForSelector(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );
    // Clicking will only act on the first element.
    await expect(page).toClick(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );
    const insertButton = await page.waitForXPath(
      `//li//span[contains(text(), 'Insert image')]`
    );
    await insertButton.click();

    // Floating menu should show up
    await page.waitForSelector(floatingMenu);
    await expect(page).toMatchElement(floatingMenu);
  });

  it('should display shapes floating menu', async () => {
    // Open a shapes tab
    await expect(page).toClick('#library-tab-shapes');

    // Add a shape
    await expect(page).toClick(
      'div[data-testid="shapes-library-pane"] div:first-child'
    );

    // Floating menu should show up
    await page.waitForSelector(floatingMenu);
    await expect(page).toMatchElement(floatingMenu);
  });
});
