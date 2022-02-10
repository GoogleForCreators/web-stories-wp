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
import {
  takeSnapshot,
  visitAdminPage,
  withRTL,
  activatePlugin,
  deactivatePlugin,
} from '@web-stories-wp/e2e-test-utils';

const percyCSS = `.plugin-version-author-uri, .amp-plugin-notice, .update-message, .subsubsub { display: none; }`;

describe('Plugin Activation', () => {
  beforeEach(async () => {
    await deactivatePlugin('web-stories');
    await activatePlugin('web-stories');
  });

  it('should display a custom message after plugin activation', async () => {
    await expect(page).toMatch("You're all set!");
    await expect(page).toMatch('Tell some stories.');

    await takeSnapshot(page, 'Plugin Activation', { percyCSS });
  });

  describe('RTL', () => {
    withRTL();

    it('should display a custom message after plugin activation', async () => {
      await deactivatePlugin('web-stories');
      await activatePlugin('web-stories');
      await expect(page).toMatch("You're all set!");
      await expect(page).toMatch('Tell some stories.');

      await takeSnapshot(page, 'Plugin Activation on RTL', { percyCSS });
    });
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

  it('should lead to the dashboard in success message', async () => {
    await expect(page).toClick('a', { text: 'Go to Stories Dashboard' });
    await page.waitForNavigation();

    // Can be Explore Templates or My Stories depending on if user has 0
    // stories, so just check that we get navigated to the dashboard
    await expect(page).toMatchElement('#web-stories-dashboard');
  });

  it('should lead to the dashboard in step 2', async () => {
    const dashboardStep = await expect(page).toMatchElement('p', {
      text: /Head to the\s?Dashboard/i,
    });
    await expect(dashboardStep).toClick('a', { text: 'Dashboard' });
    await page.waitForNavigation();

    // Can be Explore Templates or My Stories depending on if user has 0
    // stories, so just check that we get navigated to the dashboard
    await expect(page).toMatchElement('#web-stories-dashboard');
  });

  /* eslint-disable-next-line jest/no-disabled-tests --
   * Step 3 is not visible on the screen size used in E2E tests.
   * This might change in the future though.
   **/
  it.skip('should lead to the editor in step 3', async () => {
    const editorStep = await expect(page).toMatchElement('p', {
      text: /Jump into the\s?Editor/i,
    });
    await expect(editorStep).toClick('a', { text: 'Editor' });
    await page.waitForNavigation();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
  });
});
