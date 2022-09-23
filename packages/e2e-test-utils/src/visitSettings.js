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
import visitDashboard from './visitDashboard';

/**
 * Creates a new story.
 */
async function visitSettings() {
  await visitDashboard();

  await page.waitForSelector('[aria-label="Main dashboard navigation"]');

  await expect(page).toClick('[aria-label="Main dashboard navigation"] a', {
    text: 'Settings',
  });

  // Not using page.url() as it is buggy on Firefox.
  // See https://github.com/puppeteer/puppeteer/issues/6787.
  await page.waitForFunction(() => location.href.includes('#/editor-settings'));

  await expect(page).toMatchElement('h2', { text: 'Settings' });
  await expect(page).toMatch('Data Sharing Opt-in');
}

export default visitSettings;
