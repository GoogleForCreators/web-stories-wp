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
  addRequestInterception,
  createNewStory,
  publishStory,
  insertStoryTitle,
  skipSuiteOnFirefox,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

describe('Saving Story', () => {
  // Firefox does not support request interception.
  skipSuiteOnFirefox();

  describe('Chrome', () => {
    let removeErrorMessage;
    let stopRequestInterception;
    let mockResponse;

    beforeAll(async () => {
      removeErrorMessage = addAllowedErrorMessage(
        'the server responded with a status of'
      );

      await page.setRequestInterception(true);
      stopRequestInterception = addRequestInterception((request) => {
        if (
          request.url().includes('/web-stories/v1/web-story/') &&
          mockResponse
        ) {
          request.respond(mockResponse);
          return;
        }
        request.continue();
      });
    });

    afterAll(async () => {
      removeErrorMessage();

      await page.setRequestInterception(false);
      stopRequestInterception();
    });

    afterEach(() => {
      mockResponse = undefined;
    });

    it('should display published dialog', async () => {
      await createNewStory();
      await insertStoryTitle('Test story');
      await publishStory();
      await expect(page).toMatch('Story published.');
    });

    it('should display detailed error snackbar message', async () => {
      mockResponse = {
        status: 500,
        body: JSON.stringify({
          code: 'internal_server_error',
          message: '<p>There has been a critical error on this website</p>',
          data: {
            status: 500,
          },
        }),
      };
      await createNewStory();
      await insertStoryTitle('Test story 500');
      await expect(page).toClick('button', { text: /^Publish$/ });
      await expect(page).toMatchElement('div[aria-label="Story details"]');
      await expect(page).toMatch('Story Details');
      await expect(page).toClick('div[aria-label="Story details"] button', {
        text: /^Publish$/,
      });

      await page.waitForSelector('[role="alert"]');
      await expect(page).toMatchElement('[role="alert"]', {
        text: 'Failed to save the story: There has been a critical error on this website (Internal Server Error)',
      });
    });
  });
});
