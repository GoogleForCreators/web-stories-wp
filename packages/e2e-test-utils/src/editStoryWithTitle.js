/*
 * Copyright 2022 Google LLC
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

/**
 * Open an existing story with a specific title in the editor.
 *
 * @param {string} storyTitle Story title.
 * @return {Promise<void>}
 */
async function editStoryWithTitle(storyTitle) {
  await visitAdminPage('edit.php', 'post_type=web-story');
  await expect(page).toMatchTextContent(storyTitle);

  await Promise.all([
    page.waitForNavigation(),
    expect(page).toClick('a', { text: storyTitle }),
  ]);
}

export default editStoryWithTitle;
