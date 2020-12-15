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
import { percySnapshot } from '@percy/puppeteer';

/**
 * WordPress dependencies
 */
import { activatePlugin, deactivatePlugin } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { createNewStory } from '../../utils';
import { addAllowedErrorMessage } from '../../config/bootstrap';

describe('Status Check', () => {
  let removeErrorMessage;
  beforeAll(async () => {
    await activatePlugin('e2e-tests-disable-rest-api');
    removeErrorMessage = addAllowedErrorMessage(
      'the server responded with a status of 500'
    );
  });

  afterAll(async () => {
    await deactivatePlugin('e2e-tests-disable-rest-api');
    removeErrorMessage();
  });

  it('should show error dialog', async () => {
    await createNewStory();

    const statusCheckFailure = await page.$$eval(
      '[role="dialog"] h1',
      (elements) => {
        return elements.some((el) =>
          el.textContent.includes('Unable to save your story')
        );
      }
    );
    expect(statusCheckFailure).toBeTrue();

    await percySnapshot(page, 'Status check error dialog');
  });
});
