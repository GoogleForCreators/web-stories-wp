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
  takeSnapshot,
  withExperimentalFeatures,
  createNewStory,
  uploadMedia,
  deleteMedia,
  skipSuiteOnFirefox,
} from '@web-stories-wp/e2e-test-utils';

const MODAL = '.media-modal';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('SVG', () => {
  withExperimentalFeatures(['enableSVG']);

  describe('Usage', () => {
    it('should insert an existing SVG from media dialog', async () => {
      await createNewStory();

      await expect(page).toClick('button[aria-label="Upload"]');
      await expect(page).toMatch('Upload to Story');
      await expect(page).toClick('button', { text: 'Media Library' });

      await expect(page).toClick(
        '.attachments-browser .attachments .attachment[aria-label="video-play"]'
      );

      await expect(page).toClick('button', { text: 'Insert into page' });

      await expect(page).toMatchElement('[data-testid="imageElement"]');

      await takeSnapshot(page, 'Inserting SVG from Dialog');
    });

    it('should not allow selecting an SVG file as publisher logo', async () => {
      await createNewStory();

      await expect(page).toClick('li[role="tab"]', { text: 'Document' });
      await expect(page).toClick('[aria-label="Publisher Logo"]');
      await expect(page).toClick('[aria-label="Add new"]');

      await page.waitForSelector(MODAL, {
        visible: true,
      });

      await expect(page).toMatch('Select as publisher logo');
      await expect(page).toClick('button', { text: 'Media Library' });

      await expect(page).not.toMatchElement(
        '.attachments-browser .attachments .attachment[aria-label="video-play"]'
      );

      await page.keyboard.press('Escape');

      await page.waitForSelector(MODAL, {
        visible: false,
      });
    });
  });

  describe('Upload', () => {
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

    it('should upload an SVG file via media dialog', async () => {
      await createNewStory();

      const fileName = await uploadMedia('close.svg', false);
      uploadedFiles.push(fileName);

      await expect(page).toClick('button', { text: 'Insert into page' });

      await expect(page).toMatchElement('[data-testid="imageElement"]');

      await takeSnapshot(page, 'Uploading SVG to editor');
    });
  });
});
