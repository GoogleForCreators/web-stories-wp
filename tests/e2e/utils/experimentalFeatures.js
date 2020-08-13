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
 * @param {Array<string>}features Array of experiments to enable.
 * @param {boolean} enable Whether the features should be enabled or not.
 * @return {Promise<void>}
 */
async function toggleExperiments(features, enable) {
  await visitAdminPage(
    'edit.php',
    'post_type=web-story&page=web-stories-experiments'
  );

  await Promise.all(
    features.map(async (feature) => {
      const selector = `#${feature}`;
      await page.waitForSelector(selector);
      const checkedSelector = `${selector}[checked=checked]`;
      const isChecked = Boolean(await page.$(checkedSelector));
      if ((!isChecked && enable) || (isChecked && !enable)) {
        await page.click(selector);
      }
    })
  );

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('#submit'),
  ]);
}

/**
 * Establishes test lifecycle to enable experimental feature for the duration of
 * the grouped test block.
 *
 * @param {Array<string>} features Array of experiments to enable.
 */
export default function withExperimentalFeatures(features) {
  /* eslint-disable jest/require-top-level-describe */
  beforeAll(() => toggleExperiments(features, true));
  afterAll(() => toggleExperiments(features, false));
  /* eslint-enable jest/require-top-level-describe */
}
