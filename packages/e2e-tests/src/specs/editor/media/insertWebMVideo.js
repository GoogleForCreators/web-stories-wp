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
  uploadFile,
} from '@web-stories-wp/e2e-test-utils';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Inserting WebM Video', () => {
  let uploadedFiles;

  beforeEach(() => (uploadedFiles = []));

  afterEach(async () => {
    for (const file of uploadedFiles) {
      // eslint-disable-next-line no-await-in-loop
      await deleteMedia(file);
    }
  });

  async function openPanel(name) {
    // open style pane
    await expect(page).toClick('li', { text: /^Style$/ });

    // Open the panel.
    const panel = await page.$(`button[aria-label="${name}"]`);
    const isCollapsed = await page.evaluate(
      (button) => button.getAttribute('aria-expanded') === 'false',
      panel
    );
    if (isCollapsed) {
      panel.click();
    }
  }

  async function openA11yPanel() {
    // Open the Accessibility panel.
    await openPanel('Accessibility');
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

  it('should insert a video via media modal and add captions', async () => {
    await createNewStory();

    const fileName = await uploadMedia('small-video.webm', false);
    uploadedFiles.push(fileName);

    await expect(page).toClick('button', { text: 'Insert into page' });

    await expect(page).toMatchElement('[data-testid="videoElement"]');

    await openPanel('Caption and Subtitles');

    await expect(page).toClick('button', { text: 'Upload a file' });

    await expect(page).toClick('.media-modal #menu-item-upload', {
      text: 'Upload files',
      visible: true,
    });

    const fileNameCaptions = await uploadFile('test.vtt');
    uploadedFiles.push(fileNameCaptions);

    await expect(page).toClick('button', { text: 'Select caption' });

    await expect(page).toMatch('test.vtt');
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
