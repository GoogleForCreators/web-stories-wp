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
 * Establishes test lifecycle to enforce a specific user to be logged in.
 *
 * @param {string} username Username.
 * @param {string} password Password.
 */
export default function withUser(username, password) {
  /* eslint-disable jest/require-top-level-describe */
  beforeAll(async () => {
    // This will try to access wp-admin and log in as the administrator
    // if not already logged in as any user.
    await visitAdminPage('index.php');

    const currentUser = await page.evaluate(
      () => document.querySelector('.display-name')?.textContent
    );

    // No need to proceed since we're already logged in as the right user.
    if (currentUser === username) {
      return;
    }

    await loginUser(username, password);

    // Just visiting the admin page again so we can check for the logged-in status again.
    await visitAdminPage('index.php');

    await expect(page).toMatchElement('.display-name', {
      text: username,
    });
  });

  // "Reset" by trying to log in as admin again afterwards.
  afterAll(() => loginUser());
  /* eslint-enable jest/require-top-level-describe */
}
