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
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */

describe('Save story snackbar', () => {
  let stopRequestInterception;
  let mockResponse;

  beforeAll(async () => {
    await page.setRequestInterception(true);
    stopRequestInterception = addRequestInterception((request) => {
      if (request.url().includes('_fields=status%2Cslug') && mockResponse) {
        request.respond(mockResponse);
        return;
      }
      request.continue();
    });
  });

  afterAll(async () => {
    await page.setRequestInterception(false);
    stopRequestInterception();
  });

  afterEach(() => {
    mockResponse = undefined;
  });

  describe('Story saved', () => {
    it('should display published dialog', async () => {
      await createNewStory();
      await insertStoryTitle('Test story');
      await publishStory();
      await expect(page).toMatch('Story published.');
    });

    it('should display error 500 snackbar message', async () => {
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
        text: 'Server error failed to save the story',
      });
    });
  });
});
