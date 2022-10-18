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
  clearLocalStorage,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Telemetry Banner', () => {
  beforeAll(async () => {
    await visitSettings();
    await disableCheckbox('[data-testid="telemetry-settings-checkbox"]');
    await clearLocalStorage();
  });

  beforeEach(async () => {
    await visitDashboard();
  });

  afterEach(async () => {
    await clearLocalStorage();
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
});
