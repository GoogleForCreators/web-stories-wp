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
import visitAdminPage from './visitAdminPage';
import { getCurrentUser, setCurrentUser } from './user';

/**
 * Toggle experiments state.
 *
 * @param {Array<string>}features Array of experiments to enable.
 * @param {boolean} enable Whether the features should be enabled or not.
 * @return {Promise<void>}
 */
export async function toggleExperiments(features, enable) {
  const currentUser = getCurrentUser();
  await setCurrentUser('admin', 'password');

  await visitAdminPage(
    'edit.php',
    'post_type=web-story&page=web-stories-experiments'
  );

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < features.length; i++) {
    const selector = `#${features[i]}`;
    await page.waitForSelector(selector);
    const checkedSelector = `${selector}:checked`;
    const isChecked = Boolean(await page.$(checkedSelector));

    if ((!isChecked && enable) || (isChecked && !enable)) {
      await page.click(selector);
    }
  }
  /* eslint-enable no-await-in-loop */

  // Ensures the button is visible and can be clicked on in Firefox.
  await page.evaluate(() => {
    document.getElementById('submit').scrollIntoView();
  });

  await Promise.all([page.waitForNavigation(), page.click('#submit')]);
  await expect(page).toMatch('Settings saved.');
  await setCurrentUser(currentUser.username, currentUser.password);
}

/**
 * Establishes test lifecycle to enable experimental feature for the duration of
 * the grouped test block.
 *
 * @param {Array<string>} features Array of experiments to enable.
 */
export default function withExperimentalFeatures(features) {
  /* eslint-disable require-await */
  beforeAll(async () => toggleExperiments(features, true));
  afterAll(async () => toggleExperiments(features, false));
  /* eslint-enable require-await */
}
