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
 * Internal dependencies
 */
import { addRequestInterception, createNewStory } from '../../utils';
import { addAllowedErrorMessage } from '../../config/bootstrap';

async function interceptStatusCheck(status, body) {
  await page.setRequestInterception(true);
  return addRequestInterception((request) => {
    if (request.url().includes('/web-stories/v1/status-check/')) {
      request.respond({
        status,
        body,
      });
      return;
    }

    request.continue();
  });
}

describe('Status Check', () => {
  let removeErrorMessage;
  beforeAll(() => {
    removeErrorMessage = addAllowedErrorMessage(
      'the server responded with a status of'
    );
  });

  afterAll(() => {
    removeErrorMessage();
  });

  describe('200 OK', () => {
    it('should not display error dialog', async () => {
      await createNewStory();

      await expect(page).not.toMatch('Unable to save your story');
    });
  });

  describe('Invalid JSON response', () => {
    let stopRequestInterception;

    beforeAll(async () => {
      stopRequestInterception = await interceptStatusCheck(
        200,
        'This is some unexpected content before the actual response.{"success":true}'
      );
    });

    afterAll(async () => {
      await page.setRequestInterception(false);
      stopRequestInterception();
    });

    it('should display error dialog', async () => {
      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });

  describe('403 Forbidden (WAF)', () => {
    let stopRequestInterception;

    beforeAll(async () => {
      stopRequestInterception = await interceptStatusCheck(403, 'Forbidden');
    });

    afterAll(async () => {
      await page.setRequestInterception(false);
      stopRequestInterception();
    });

    it('should display error dialog', async () => {
      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });

  describe('500 Internal Server Error', () => {
    let stopRequestInterception;

    beforeAll(async () => {
      stopRequestInterception = await interceptStatusCheck(500, 'Forbidden');
    });

    afterAll(async () => {
      await page.setRequestInterception(false);
      stopRequestInterception();
    });

    it('should display error dialog', async () => {
      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });
});
