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
import { disableCheckbox, visitSettings } from '@web-stories-wp/e2e-test-utils';

describe('Telemetry Banner', () => {
  beforeEach(async () => {
    await visitSettings();
  });

  afterEach(async () => {
    await page.evaluate(() => {
      window.location.hash = '#';
      localStorage.clear();
    });
  });

  afterAll(async () => {
    await visitSettings();
    await disableCheckbox('[data-testid="telemetry-settings-checkbox"]');
    await page.evaluate(() => {
      localStorage.removeItem('web_stories_tracking_optin_banner_closed');
    });
  });

  it('should render the telemetry settings checkbox', async () => {
    const settingsView = await page.$('[data-testid="editor-settings"]');
    expect(settingsView).toBeTruthy();

    const TelemetrySettingsCheckbox = await page.$(
      '[data-testid="telemetry-settings-checkbox"]'
    );
    expect(TelemetrySettingsCheckbox).toBeTruthy();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should toggle the value and call the API provider when the tracking opt in box is clicked and display snackbar confirmation', async () => {
    await disableCheckbox('[data-testid="telemetry-settings-checkbox"]');

    const settingsView = await page.$('[data-testid="editor-settings"]');
    expect(settingsView).toBeTruthy();

    const telemetrySettingsCheckbox = await page.$(
      '[data-testid="telemetry-settings-checkbox"]'
    );
    const checkboxStatus = await telemetrySettingsCheckbox.evaluate((el) => {
      return el.checked;
    });

    expect(checkboxStatus).toBeFalse();

    await expect(page).toClick('[data-testid="telemetry-settings-checkbox"]');

    await page.waitForTimeout(300);

    const updatedCheckboxStatus = await telemetrySettingsCheckbox.evaluate(
      (el) => {
        return el.checked;
      }
    );
    expect(updatedCheckboxStatus).toBeTrue();
  });
});
