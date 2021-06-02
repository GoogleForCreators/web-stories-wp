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
 * WordPress dependencies
 */
import { loginUser, visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
/**
 * External dependencies
 */
import percySnapshot from '@percy/puppeteer';
import { createNewStory } from '@web-stories-wp/e2e-test-utils';

describe('Contributor User', () => {
  // eslint-disable-next-line jest/expect-expect
  it('should successfully log in as contributor', async () => {
    await loginUser('contributor', 'password');
    // Take screenshot *before* `createNewStory`/`visitAdminPage` logs in as admin.
    await percySnapshot(page, 'Contributor logged in');
    await createNewStory();
    await percySnapshot(page, 'Contributor creating a story');
    await visitAdminPage('users.php');
    await percySnapshot(page, 'User list');
  });
});
