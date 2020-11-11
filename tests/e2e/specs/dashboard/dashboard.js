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
 * Internal dependencies
 */
import { activateRTL, deactivateRTL, visitDashboard } from '../../utils';

const percyCSS = `.dashboard-grid-item-date { display: none; }`;

describe('Stories Dashboard', () => {
  it('should be able to open the dashboard', async () => {
    await visitDashboard();

    await expect(page).toMatch('My Stories');

    await percySnapshot(page, 'Stories Dashboard', { percyCSS });
  });
  it('should be able to open the dashboard on RTL', async () => {
    await activateRTL();
    await visitDashboard();

    await expect(page).toMatch('My Stories');

    await percySnapshot(page, 'Stories Dashboard on RTL', { percyCSS });
    await deactivateRTL();
  });
});
