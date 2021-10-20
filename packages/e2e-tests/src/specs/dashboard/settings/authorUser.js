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
  disableCheckbox,
  enableCheckbox,
  visitSettings,
  withUser,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
  telemetryCheckboxSelector,
  videoCacheCheckboxSelector,
  videoOptimizationCheckboxSelector,
} from '../../../utils';

describe('Author User', () => {
  // eslint-disable-next-line jest/require-hook
  withUser('author', 'password');

  beforeEach(async () => {
    await visitSettings();

    await enableCheckbox(telemetryCheckboxSelector);
    await enableCheckbox(videoOptimizationCheckboxSelector);
  });

  afterEach(async () => {
    await visitSettings();

    await enableCheckbox(telemetryCheckboxSelector);
    await enableCheckbox(videoOptimizationCheckboxSelector);
  });

  it('should let me upload publisher logos', async () => {
    // verify no publisher logos are shown
    await expect(page).not.toMatchElement(
      '[data-testid="publisher-logos-container"]'
    );
  });

  it('should let me see and update the telemetry checkbox', async () => {
    await disableCheckbox(telemetryCheckboxSelector);

    await expect(page).toMatchElement(
      `${telemetryCheckboxSelector}:not(:checked)`
    );
  });

  it('should let me see and update the video optimization checkbox', async () => {
    await disableCheckbox(videoOptimizationCheckboxSelector);

    await expect(page).toMatchElement(
      `${videoOptimizationCheckboxSelector}:not(:checked)`
    );
  });

  it('should not let me see other settings', async () => {
    await expect(page).not.toMatchElement(videoCacheCheckboxSelector);
  });
});
