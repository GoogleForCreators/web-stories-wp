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
} from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

describe('Background Audio', () => {
  let uploadedFiles = [];

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
      await expect(page).toClick('[aria-label="Background Audio"]');

      await expect(page).toClick('button', { text: 'Upload an audio file' });

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      const fileName = await uploadFile('audio.mp3', false);
      const fileNameNoExt = fileName.replace(/\.[^/.]+$/, '');
      uploadedFiles.push(fileNameNoExt);

      await expect(page).toClick('button', { text: 'Select audio file' });
      await expect(page).toMatchElement('button[aria-label="Play"]');
      await expect(page).toMatchElement('button[aria-label="Remove file"]');

      await percySnapshot(page, 'Story Background Audio');
    });
  });

  describe('Page Background Audio', () => {
    it('should allow adding background audio', async () => {
      await createNewStory();

      // Select the current page by clicking on it in the carousel.
      await expect(page).toClick('[aria-label="Page 1 (current page)"]');

      await expect(page).toClick('[aria-label="Background Audio"]');

      await expect(page).toClick('button', { text: 'Upload an audio file' });

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      const fileName = await uploadFile('audio.mp3', false);
      const fileNameNoExt = fileName.replace(/\.[^/.]+$/, '');
      uploadedFiles.push(fileNameNoExt);

      await expect(page).toClick('button', { text: 'Select audio file' });
      await expect(page).toMatchElement('button[aria-label="Play"]');
      await expect(page).toMatchElement('button[aria-label="Remove file"]');
    });
  });
});
