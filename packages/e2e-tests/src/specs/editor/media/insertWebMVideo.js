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
import {
  createNewStory,
  previewStory,
  insertStoryTitle,
  uploadMedia,
  deleteMedia,
} from '@web-stories-wp/e2e-test-utils';

describe('Inserting WebM Video', () => {
  let uploadedFiles;

  beforeEach(() => (uploadedFiles = []));

  afterEach(async () => {
    for (const file of uploadedFiles) {
      // eslint-disable-next-line no-await-in-loop
      await deleteMedia(file);
    }
  });

  async function openA11yPanel() {
    // open style pane
    await expect(page).toClick('li', { text: /^Style$/ });

    // Open the Accessibility panel.
    const a11yPanel = await page.$('button[aria-label="Accessibility"]');
    const isCollapsed = await page.evaluate(
      (button) => button.getAttribute('aria-expanded') === 'false',
      a11yPanel
    );
    if (isCollapsed) {
      a11yPanel.click();
    }
  }

  it('should insert a video via media modal', async () => {
    await createNewStory();

    const fileName = await uploadMedia('small-video.webm', false);
    uploadedFiles.push(fileName);

    await expect(page).toClick('button', { text: 'Insert into page' });

    await expect(page).toMatchElement('[data-testid="videoElement"]');

    // Wait for poster image (inside Accessibility panel) to appear.
    await openA11yPanel();
    await page.waitForSelector('[alt="Preview poster image"]');
    await expect(page).toMatchElement('[alt="Preview poster image"]');
  });

  it('should insert a video via media library', async () => {
    await createNewStory();

    const fileName = await uploadMedia('small-video.webm');
    uploadedFiles.push(fileName);

    await page.waitForSelector(
      `[data-testid="mediaElement-video"] [src*="${fileName}"`
    );
    // Clicking will only act on the first element.
    await expect(page).toClick('[data-testid="mediaElement-video"]');
    const insertButton = await page.waitForXPath(
      `//li//span[contains(text(), 'Insert video')]`
    );
    await insertButton.click();

    await page.waitForSelector('[data-testid="videoElement"]');
    await expect(page).toMatchElement('[data-testid="videoElement"]');

    // Wait for poster image (inside Accessibility panel) to appear.
    await openA11yPanel();
    await page.waitForSelector('[alt="Preview poster image"]');
    await expect(page).toMatchElement('[alt="Preview poster image"]');
  });

  it('should insert a video via media library and preview on FE', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing with video');

    const fileName = await uploadMedia('small-video.webm');
    uploadedFiles.push(fileName);

    await page.waitForSelector(
      `[data-testid="mediaElement-video"] [src*="${fileName}"`
    );
    // Clicking will only act on the first element.
    await expect(page).toClick('[data-testid="mediaElement-video"]');
    const insertButton = await page.waitForXPath(
      `//li//span[contains(text(), 'Insert video')]`
    );
    await insertButton.click();

    await page.waitForSelector('[data-testid="videoElement"]');
    await expect(page).toMatchElement('[data-testid="videoElement"]');

    // Wait for poster image (inside Accessibility panel) to appear.
    await openA11yPanel();
    await page.waitForSelector('[alt="Preview poster image"]');
    await expect(page).toMatchElement('[alt="Preview poster image"]');

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('amp-video');

    const poster = await previewPage.evaluate((selector) => {
      return document.querySelector(selector).getAttribute('poster');
    }, 'amp-video');

    expect(poster).not.toBeNull();
    expect(poster).toStrictEqual(expect.any(String));
    expect(poster).not.toBe('');

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
