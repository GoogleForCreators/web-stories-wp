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
import { setCurrentUser } from './user';
import visitAdminPage from './visitAdminPage';

async function deactivatePlugin(slug) {
  await setCurrentUser('admin', 'password');
  await visitAdminPage('plugins.php');
  const deleteLink = await page.$(`tr[data-slug="${slug}"] .delete a`);

  if (deleteLink) {
    await setCurrentUser('admin', 'password');
    return;
  }

  await page.click(`tr[data-slug="${slug}"] .deactivate a`);
  await page.waitForSelector(`tr[data-slug="${slug}"] .delete a`);
}

export default deactivatePlugin;
