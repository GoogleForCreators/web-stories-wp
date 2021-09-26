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
 * Navigates to the taxonomy's list table and bulk-trashes any terms which exist.
 *
 * @param {string} taxonomy Taxonomy slug.
 * @return {Promise<void>} Promise resolving once terms have been trashed.
 */
async function trashAllTerms(taxonomy) {
  const currentUser = getCurrentUser();
  await setCurrentUser('admin', 'password');

  await visitAdminPage('edit-tags.php', `taxonomy=${taxonomy}`);

  await page.waitForSelector('[id^=cb-select-all-]');
  await page.click('[id^=cb-select-all-]');
  await page.select('#bulk-action-selector-top', 'delete');
  await Promise.all([page.waitForNavigation(), page.click('#doaction')]);

  await setCurrentUser(currentUser.username, currentUser.password);
}

export default trashAllTerms;
