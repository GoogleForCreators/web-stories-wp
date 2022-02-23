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
 * Publishes the story in the editor.
 *
 * @param {boolean} [dismiss=true] Whether to dismiss the success dialog.
 * @return {Promise<void>}
 */
async function publishStory(dismiss = true) {
  await expect(page).toClick('button', { text: 'Publish' });
  await expect(page).toMatchElement('div[aria-label="Story details"]');
  await expect(page).toMatch('Story Details');
  await expect(page).toClick('div[aria-label="Story details"] button', {
    text: 'Publish',
  });

  await expect(page).toMatch('Story published.');

  await expect(page).toMatchElement('button', { text: 'Dismiss' });

  if (dismiss) {
    await expect(page).toClick('button', { text: 'Dismiss' });
  }
}

export default publishStory;
