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
