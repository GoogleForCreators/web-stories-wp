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
  disableCheckbox,
  visitDashboard,
  visitSettings,
} from '@web-stories-wp/e2e-test-utils';

describe('Telemetry Banner', () => {
  beforeAll(async () => {
    await visitSettings();
    await disableCheckbox('[data-testid="telemetry-settings-checkbox"]');
    await page.evaluate(() => {
      localStorage.removeItem('web_stories_tracking_optin_banner_closed');
    });
  });

  beforeEach(async () => {
    await visitDashboard();
  });

  afterEach(async () => {
    await page.evaluate(() => {
      localStorage.removeItem('web_stories_tracking_optin_banner_closed');
    });
  });

  afterAll(async () => {
    await visitSettings();
    await disableCheckbox('[data-testid="telemetry-settings-checkbox"]');
    await page.evaluate(() => {
      localStorage.removeItem('web_stories_tracking_optin_banner_closed');
    });
  });

  it('should render the telemetry opt in banner', async () => {
    await expect(page).toMatch('Help improve the editor!');
  });

  it('should close the banner when the exit button is closed', async () => {
    await expect(page).toMatch('Help improve the editor!');
    await expect(page).toClick('[aria-label="Dismiss telemetry banner"]');
    await expect(page).not.toMatch('Help improve the editor!');
  });

  it('should not display the banner after it has been closed', async () => {
    await expect(page).toMatch('Help improve the editor!');
    await expect(page).toClick('[aria-label="Dismiss telemetry banner"]');
    await page.reload();
    await expect(page).not.toMatch('Help improve the editor!');
  });

  // Skipped for https://github.com/google/web-stories-wp/issues/9619
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should keep focus on the checkbox when checking/unchecking via keyboard', async () => {
    await page.waitForTimeout(300); // Because dashboard takes some time before banner appears.

    const checkbox = await page.$('#telemetry-banner-opt-in');
    await checkbox?.focus();

    await page.keyboard.press('Space');
    const optedIn = await page.evaluate(() => {
      const ele = document.getElementById('telemetry-banner-opt-in');
      return document.activeElement === ele;
    });
    expect(optedIn).toBeFalse();
    await page.keyboard.press('Space');

    const updatedOptedIn = await page.evaluate(() => {
      const ele = document.getElementById('telemetry-banner-opt-in');
      return document.activeElement === ele;
    });
    expect(updatedOptedIn).toBeTrue();
  });
});
