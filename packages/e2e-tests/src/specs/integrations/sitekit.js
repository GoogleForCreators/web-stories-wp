/*
 * Copyright 2021 Google LLC
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
  addTextElement,
  createNewStory,
  previewStory,
  insertStoryTitle,
  withPlugin,
  visitSettings,
  trashAllPosts,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Site Kit plugin integration', () => {
  describe('Google Analytics', () => {
    withPlugin('e2e-tests-site-kit-analytics-mock');

    describe('Dashboard', () => {
      it('should see Site Kit specific message', async () => {
        await visitSettings();

        await expect(page).toMatchTextContent(
          'Site Kit by Google has already enabled Google Analytics for your Web Stories'
        );
      });
    });

    describe('Editor', () => {
      afterAll(async () => {
        await trashAllPosts('web-story');
      });

      it('should print an analytics tag', async () => {
        await createNewStory();

        await insertStoryTitle('Previewing Analytics');

        await addTextElement();

        const editorPage = page;
        const previewPage = await previewStory();
        await expect(previewPage).toMatchTextContent('XXX-YYY');

        await editorPage.bringToFront();
        await previewPage.close();
      });
    });
  });

  describe('Google AdSense', () => {
    withPlugin('e2e-tests-site-kit-adsense-mock');

    describe('Dashboard', () => {
      it('should see Site Kit specific message', async () => {
        await visitSettings();

        await expect(page).toMatchTextContent(
          'Site Kit by Google has already enabled Google AdSense for your Web Stories'
        );
      });
    });
  });
});
