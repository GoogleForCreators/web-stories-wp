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
import { createNewStory, withPlugin } from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

// TODO: Use request interception instead of WP plugins once supported in Firefox.
// See https://bugzilla.mozilla.org/show_bug.cgi?id=1587857
// eslint-disable-next-line jest/no-disabled-tests -- TODO(#11991): Fix flakey test.
describe.skip('Status Check', () => {
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
    withPlugin('web-stories-test-plugin-status-check-200-invalid');

    it('should display error dialog', async () => {
      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });

  describe('403 Forbidden (WAF)', () => {
    withPlugin('web-stories-test-plugin-status-check-403');

    it('should display error dialog', async () => {
      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });

  describe('500 Internal Server Error', () => {
    withPlugin('web-stories-test-plugin-status-check-500');

    it('should display error dialog', async () => {
      await createNewStory();
      await expect(page).toMatch('Unable to save your story');
    });
  });
});
