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
import visitSettings from './visitSettings';

/**
 * Toggle video optimization user preference on the settings page.
 *
 * @param {boolean} enable Whether the setting should be enabled or not.
 * @return {Promise<void>}
 */
async function toggleVideoOptimization(enable = true) {
  await visitSettings();
  await page.waitForSelector(
    '[data-testid="media-optimization-settings-checkbox"]'
  );

  const isChecked = Boolean(
    await page.$('[data-testid="media-optimization-settings-checkbox"]:checked')
  );

  if ((isChecked && enable) || (!isChecked && !enable)) {
    return;
  }

  await expect(page).toClick(
    '[data-testid="media-optimization-settings-checkbox"]'
  );

  // Await REST API request.
  await page.waitForResponse((response) =>
    response.url().includes('web-stories/v1/users/me')
  );
}
export default toggleVideoOptimization;
