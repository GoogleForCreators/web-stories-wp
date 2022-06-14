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
  deleteMedia,
  skipSuiteOnFirefox,
  toggleVideoOptimization,
  uploadFile,
} from '@web-stories-wp/e2e-test-utils';

describe('Handling .mov files', () => {
  // Firefox does not yet support file uploads with Puppeteer. See https://bugzilla.mozilla.org/show_bug.cgi?id=1553847.
  skipSuiteOnFirefox();

  let uploadedFiles;

  beforeEach(() => (uploadedFiles = []));

  afterEach(async () => {
    for (const file of uploadedFiles) {
      // eslint-disable-next-line no-await-in-loop
      await deleteMedia(file);
    }
  });

  describe('Enabled', () => {
    beforeEach(async () => {
      await toggleVideoOptimization(true);
    });

    afterEach(async () => {
      await toggleVideoOptimization(false);
    });

    // Flakey test, see https://github.com/googleforcreators/web-stories-wp/issues/8232.
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should insert .mov video from media dialog', async () => {
      await createNewStory();

      await expect(page).toClick('button[aria-label="Upload"]');

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      await expect(page).toClick('.media-modal #menu-item-upload', {
        text: 'Upload files',
        visible: true,
      });

      const fileName = await uploadFile('small-video.mov', false);
      uploadedFiles.push(fileName);

      await expect(page).toClick('button', { text: 'Insert into page' });

      await page.waitForSelector('[data-testid="videoElement"]', {
        visible: false,
      });
      await expect(page).toMatchElement('[data-testid="videoElement"]', {
        visible: false,
      });
    });
  });

  describe('Disabled', () => {
    it('should not list the .mov video in the media dialog', async () => {
      await createNewStory();
      await expect(page).toClick('button[aria-label="Upload"]');

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      await expect(page).toClick('.media-modal #menu-item-upload', {
        text: 'Upload files',
        visible: true,
      });

      const fileName = await uploadFile('small-video.mov', false);
      uploadedFiles.push(fileName);

      await expect(page).toClick(
        '.attachments-browser .attachments .attachment:first-of-type'
      );

      await expect(page).not.toMatchElement('.type-video.subtype-quicktime');

      await page.keyboard.press('Escape');

      await page.waitForSelector('.media-modal', {
        visible: false,
      });
    });
  });
});
