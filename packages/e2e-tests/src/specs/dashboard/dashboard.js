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
  withRTL,
  visitDashboard,
  createNewStory,
  insertStoryTitle,
  publishStory,
} from '@web-stories-wp/e2e-test-utils';

const percyCSS = `.dashboard-grid-item-date { display: none; }`;

describe('Stories Dashboard', () => {
  it('should be able to open the dashboard', async () => {
    await visitDashboard();

    // If there are no existing stories, the app goes to the templates page instead.
    // Account for both here, but then force-visit the dashboard.
    await expect(page).toMatchElement('h2', {
      text: /(Dashboard|Explore Templates)/,
    });

    await expect(page).toClick('[aria-label="Main dashboard navigation"] a', {
      text: 'Dashboard',
    });

    await takeSnapshot(page, 'Stories Dashboard', { percyCSS });
  });

  //eslint-disable-next-line jest/no-disabled-tests -- TODO(#11930): Fix flakey test.
  it.skip('should be able to skip to main content of Dashboard for keyboard navigation', async () => {
    await visitDashboard();

    // If there are no existing stories, the app goes to the templates page instead.
    // Either is fine since we're testing keyboard navigation.
    await expect(page).toMatchElement('h2', {
      text: /(Dashboard|Explore Templates)/,
    });

    // When navigating to Dashboard, immediately use keyboard to
    // tab to WordPress shortcut of "Main Content"
    page.keyboard.press('Tab');
    // Verify that Main Content skip link is present
    await expect(page).toMatchElement('a', { text: 'Skip to main content' });
    // Use the keyboard to select skip link while it is present (since it's now focused)
    page.keyboard.press('Enter');
    // Make sure we see the dashboard
    await expect(page).toMatchElement('h2', {
      text: /^Dashboard/,
    });
    // Now let's make sure that the next focusable element is the link to create a new story
    page.keyboard.press('Tab');

    const activeElement = await page.evaluate(() => {
      return {
        text: document.activeElement.textContent,
        element: document.activeElement.tagName.toLowerCase(),
      };
    });
    await expect(activeElement).toMatchObject({
      text: 'Create New Story',
      element: 'a',
    });

    await takeSnapshot(page, 'Stories Dashboard on Keyboard Navigation', {
      percyCSS,
    });
  });

  it('should choose sort option for display', async () => {
    // dropdown needs a story for filtering
    await createNewStory();
    await insertStoryTitle('Stories Dashboard test - story');
    await publishStory();
    await visitDashboard();
    await expect(page).toClick('[aria-label="Dashboard (active view)"]', {
      text: 'Dashboard',
    });
    const sortButtonSelector =
      'button[aria-label="Choose sort option for display"]';
    await expect(page).toClick(sortButtonSelector, { text: 'Last Modified' });
    await takeSnapshot(page, 'Dashboard sort option dropdown', { percyCSS });
    await expect(page).toClick('li', { text: 'Created By' });
    await expect(page).toMatchElement(sortButtonSelector, {
      text: 'Created By',
    });
  });

  describe('RTL', () => {
    withRTL();

    it('should be able to open the dashboard', async () => {
      await visitDashboard();

      await expect(page).toMatchElement('h2', {
        text: /(Dashboard|Explore Templates)/,
      });

      await expect(page).toClick('[aria-label="Main dashboard navigation"] a', {
        text: 'Dashboard',
      });

      await takeSnapshot(page, 'Stories Dashboard on RTL', { percyCSS });
    });
  });
});
