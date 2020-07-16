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
 * External dependencies
 */
import { percySnapshot } from '@percy/puppeteer';

/**
 * WordPress dependencies
 */
import {
  activatePlugin,
  deactivatePlugin,
  visitAdminPage,
} from '@wordpress/e2e-test-utils';

describe('Plugin Activation', () => {
  beforeEach(async () => {
    await deactivatePlugin('web-stories');
    await activatePlugin('web-stories');
  });

  it('should display a custom message after plugin activation', async () => {
    await expect(page).toMatch("You're all set!");
    await expect(page).toMatch('Tell some stories.');

    await percySnapshot(page, 'Plugin Activation');
  });

  it('should dismiss plugin activation message', async () => {
    await expect(page).toClick('button', { text: /Dismiss this notice/ });
    await expect(page).not.toMatch("You're all set!");
    await expect(page).not.toMatch('Tell some stories.');
  });

  it('should not display message when visiting plugins screen a second time', async () => {
    await visitAdminPage('plugins.php');
    await expect(page).not.toMatch("You're all set!");
    await expect(page).not.toMatch('Tell some stories.');
  });

  it('should lead to the editor in success message', async () => {
    await expect(page).toClick('a', { text: 'Launch the editor' });
    await page.waitForNavigation();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
  });

  it('should lead to the dashboard in step 2', async () => {
    const dashboardStep = await expect(page).toMatchElement('p', {
      text: /Head to\s?Dashboard/i,
    });
    await expect(dashboardStep).toClick('a', { text: 'Dashboard' });
    await page.waitForNavigation();

    await expect(page).toMatch('My Stories');
  });

  it('should lead to the editor in step 3', async () => {
    await expect(page).toClick('a', { text: 'Jump into the editor' });
    await page.waitForNavigation();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
  });
});
