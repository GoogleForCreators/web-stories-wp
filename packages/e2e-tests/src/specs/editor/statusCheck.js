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
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

describe('Status Check', () => {
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
        request.url().includes('/web-stories/v1/status-check/') &&
        mockResponse
      ) {
        request.respond(mockResponse);
        return;
      }

      request.continue();
    });
  });

  afterEach(() => {
    mockResponse = undefined;
  });

  afterAll(async () => {
    removeErrorMessage();
    await page.setRequestInterception(false);
    stopRequestInterception();
  });

  describe('200 OK', () => {
    it('should not display error dialog', async () => {
      await createNewStory();

      await expect(page).not.toMatch('Unable to save your story');
    });
  });

  describe('Invalid JSON response', () => {
    it('should display error dialog', async () => {
      mockResponse = {
        status: 200,
        body: 'This is some unexpected content before the actual response.{"success":true}',
      };

      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });

  describe('403 Forbidden (WAF)', () => {
    it('should display error dialog', async () => {
      mockResponse = {
        status: 403,
        body: 'Forbidden',
      };

      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });

  describe('500 Internal Server Error', () => {
    it('should display error dialog', async () => {
      mockResponse = {
        status: 500,
        body: 'Forbidden',
      };

      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });
});
