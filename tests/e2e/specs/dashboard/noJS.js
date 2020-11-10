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

describe('Stories Dashboard with disabled JavaScript', () => {
  it('should display error message', async () => {
    // Disable javascript for test.
    await page.setJavaScriptEnabled(false);

    await visitDashboard();

    await expect(page).toMatchElement('#web-stories-no-js');

    // Re-enable javascript for snapsnots.
    await page.setJavaScriptEnabled(true);

    await percySnapshot(page, 'Dashboard no js');
  });

  it('should display error message on RTL', async () => {
    await activateRTL();
    // Disable javascript for test.
    await page.setJavaScriptEnabled(false);

    await visitDashboard();

    await expect(page).toMatchElement('#web-stories-no-js');

    // Re-enable javascript for snapsnots.
    await page.setJavaScriptEnabled(true);

    await percySnapshot(page, 'Dashboard no js on RTL');
    await deactivateRTL();
  });
});
