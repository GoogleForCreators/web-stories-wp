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
  uploadFile,
  deleteMedia,
  takeSnapshot,
  withExperimentalFeatures,
  withPlugin,
} from '@web-stories-wp/e2e-test-utils';

const VTT_URL = `${process.env.WP_BASE_URL}/wp-content/e2e-assets/test.vtt`;

describe('Background Audio', () => {
  let uploadedFiles;

  beforeEach(() => (uploadedFiles = []));

  afterEach(async () => {
    for (const file of uploadedFiles) {
      // eslint-disable-next-line no-await-in-loop
      await deleteMedia(file);
    }
  });

  describe('Story Background Audio', () => {
    it('should allow adding background audio', async () => {
      await createNewStory();

      await expect(page).toClick('li[role="tab"]', { text: 'Document' });

      await expect(page).toMatch('Background Audio');

      // Toggle the panel which is collapsed by default.
      await expect(page).toClick('[aria-label="Background Audio"]');

      await expect(page).toClick('button', { text: 'Upload an audio file' });

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      await expect(page).toClick('.media-modal #menu-item-upload', {
        text: 'Upload files',
        visible: true,
      });

      const fileName = await uploadFile('audio.mp3');
      uploadedFiles.push(fileName);

      await expect(page).toClick('button', { text: 'Select audio file' });

      await page.waitForSelector('.media-modal', {
        visible: false,
      });

      await expect(page).toMatch(fileName);

      await expect(page).toMatchElement('button[aria-label="Play"]');

      await takeSnapshot(page, 'Story Background Audio');
    });
  });

  describe('Page Background Audio', () => {
    it('should allow adding background audio', async () => {
      await createNewStory();

      // Select the current page by clicking bg change quick action (because of empty state).
      await expect(page).toClick('button', { text: 'Change background color' });

      await expect(page).toMatch('Page Background Audio');

      await expect(page).toClick('button', { text: 'Upload an audio file' });

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      await expect(page).toClick('.media-modal #menu-item-upload', {
        text: 'Upload files',
        visible: true,
      });

      const fileName = await uploadFile('audio.mp3');
      uploadedFiles.push(fileName);

      await expect(page).toClick('button', { text: 'Select audio file' });

      await page.waitForSelector('.media-modal', {
        visible: false,
      });

      await expect(page).toMatch(fileName);

      await expect(page).toMatchElement('button[aria-label="Play"]');
    });

    it('should allow adding background audio with captions', async () => {
      await createNewStory();

      // Select the current page by clicking bg change quick action (because of empty state).
      await expect(page).toClick('button', { text: 'Change background color' });

      await expect(page).toMatch('Page Background Audio');

      await expect(page).toClick('button', { text: 'Upload an audio file' });

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      await expect(page).toClick('.media-modal #menu-item-upload', {
        text: 'Upload files',
        visible: true,
      });

      const fileName = await uploadFile('audio.mp3');
      uploadedFiles.push(fileName);

      await expect(page).toClick('button', { text: 'Select audio file' });

      await page.waitForSelector('.media-modal', {
        visible: false,
      });

      await expect(page).toMatch(fileName);

      await expect(page).toMatchElement('button[aria-label="Play"]');

      await expect(page).toClick('button', { text: 'Upload audio captions' });

      await expect(page).toClick('.media-modal #menu-item-upload', {
        text: 'Upload files',
        visible: true,
      });

      const fileNameCaptions = await uploadFile('test.vtt');
      uploadedFiles.push(fileNameCaptions);

      await expect(page).toClick('button', { text: 'Select caption' });

      await expect(page).toMatch('test.vtt');
    });

    describe('Hotlink captions', () => {
      withExperimentalFeatures(['captionHotlinking']);
      withPlugin('e2e-tests-hotlink-hotwire');

      it('should allow adding background audio with captions', async () => {
        await createNewStory();

        // Select the current page by clicking bg change quick action (because of empty state).
        await expect(page).toClick('button', {
          text: 'Change background color',
        });

        await expect(page).toMatch('Page Background Audio');

        await expect(page).toClick('button', { text: 'Upload an audio file' });

        await page.waitForSelector('.media-modal', {
          visible: true,
        });

        await expect(page).toClick('.media-modal #menu-item-upload', {
          text: 'Upload files',
          visible: true,
        });

        const fileName = await uploadFile('audio.mp3');
        uploadedFiles.push(fileName);

        await expect(page).toClick('button', { text: 'Select audio file' });

        await page.waitForSelector('.media-modal', {
          visible: false,
        });

        await expect(page).toMatch(fileName);

        await expect(page).toMatchElement('button[aria-label="Play"]');

        await expect(page).toClick('button', { text: 'Link to file' });

        const dialogSelector = '.ReactModal__Content';

        await page.waitForSelector(dialogSelector);

        const dialog = await expect(page).toMatchElement(dialogSelector);

        await page.keyboard.type(VTT_URL);

        await expect(dialog).toClick('button', { text: 'Insert' });

        await expect(page).not.toMatchElement(dialogSelector);

        await expect(page).toMatch('test.vtt');
      });
    });
  });
});
