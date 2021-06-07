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
 * Internal dependencies
 */
import visitAdminPage from './visitAdminPage';
import { getCurrentUser, setCurrentUser } from './user';

/**
 * Navigates to the post listing screen and bulk-trashes any posts which exist.
 *
 * Note: any lingering locked posts cannot be trashed.
 *
 * @param {string} postType Post type slug.
 * @return {Promise<void>} Promise resolving once posts have been trashed.
 */
async function trashAllPosts(postType = 'post') {
  const currentUser = getCurrentUser();
  await setCurrentUser('admin', 'password');

  // Visit `/wp-admin/edit.php` so we can see a list of posts and delete them.
  await visitAdminPage('edit.php', `post_type=${postType}`);

  // If this selector doesn't exist there are no posts for us to delete.
  const bulkSelector = await page.$('#bulk-action-selector-top');
  if (bulkSelector) {
    // Select all posts.
    await page.waitForSelector('[id^=cb-select-all-]');
    await page.click('[id^=cb-select-all-]');
    // Select the "bulk actions" > "trash" option.
    await page.select('#bulk-action-selector-top', 'trash');
    // Submit the form to send all draft/scheduled/published posts to the trash.
    await Promise.all([page.waitForNavigation(), page.click('#doaction')]);
  }

  await setCurrentUser(currentUser.username, currentUser.password);
}

export default trashAllPosts;
