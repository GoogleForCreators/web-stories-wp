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
  uploadMedia,
  deleteMedia,
  withUser,
  skipSuiteOnFirefox,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Inserting Media from Dialog', () => {
  describe('Administrator', () => {
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

    it('should insert an image by clicking on it', async () => {
      await createNewStory();

      const fileName = await uploadMedia('example-1.jpg', false);
      uploadedFiles.push(fileName);

      await expect(page).toClick('button', { text: 'Insert into page' });

      await expect(page).toMatchElement('[data-testid="imageElement"]');
    });
  });

  describe('Contributor User', () => {
    withUser('contributor', 'password');

    it('should display permission error dialog', async () => {
      await createNewStory();
      await expect(page).toMatch('Howdy, contributor');

      await expect(page).not.toMatchElement('button[aria-label="Upload"]');
    });
  });
});
