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
 * External dependencies
 */
import {
  clickButton,
  disableCheckbox,
  enableCheckbox,
  visitSettings,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
  monetizationDropdownSelector,
  telemetryCheckboxSelector,
  videoCacheCheckboxSelector,
  videoOptimizationCheckboxSelector,
} from '../../../utils';

describe('Admin User', () => {
  beforeEach(async () => {
    await visitSettings();

    await enableCheckbox(telemetryCheckboxSelector);
    await enableCheckbox(videoOptimizationCheckboxSelector);
    await enableCheckbox(videoCacheCheckboxSelector);
  });

  afterEach(async () => {
    await visitSettings();

    await enableCheckbox(telemetryCheckboxSelector);
    await enableCheckbox(videoOptimizationCheckboxSelector);
    await enableCheckbox(videoCacheCheckboxSelector);
  });

  it('should let me see and update all settings', async () => {
    // verify that the telemetry checkbox can be changed
    await expect(page).toMatchElement(`${telemetryCheckboxSelector}:checked`);
    await disableCheckbox(telemetryCheckboxSelector);

    // verify that the video optimization checkbox can be changed
    await expect(page).toMatchElement(
      `${videoOptimizationCheckboxSelector}:checked`
    );
    await disableCheckbox(videoOptimizationCheckboxSelector);

    // verify that the video cache checkbox can be changed
    await expect(page).toMatchElement(`${videoCacheCheckboxSelector}:checked`);
    await disableCheckbox(videoCacheCheckboxSelector);

    // verify that the monetization settings can be changed
    await clickButton(monetizationDropdownSelector, {
      text: 'None',
    });
    await expect(page).toClick('button', { text: 'Google AdSense' });
    await expect(page).toMatchElement(monetizationDropdownSelector, {
      text: 'Google AdSense',
    });
  });
});
