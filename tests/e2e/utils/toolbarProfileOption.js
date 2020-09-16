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
import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Toggle experiments state.
 *
 * @param {boolean} enable Whether the option should be enabled or not.
 * @return {Promise<void>}
 */
async function toggleToolbarProfileOption(enable) {
  await visitAdminPage('profile.php');

  const selector = `#admin_bar_front`;
  await page.waitForSelector(selector);
  const checkedSelector = `${selector}[checked=checked]`;
  const isChecked = Boolean(await page.$(checkedSelector));
  if ((!isChecked && enable) || (isChecked && !enable)) {
    await page.click(selector);
  }

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('#submit'),
  ]);
}

/**
 * Establishes test lifecycle to disable the toolbar on the frontend
 * for the duration of the grouped test block.
 */
export default function withDisabledToolbarOnFrontend() {
  /* eslint-disable jest/require-top-level-describe */
  beforeAll(() => toggleToolbarProfileOption(false));
  afterAll(() => toggleToolbarProfileOption(true));
  /* eslint-enable jest/require-top-level-describe */
}
