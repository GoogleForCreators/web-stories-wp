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
import { visitSettings, withUser } from '@web-stories-wp/e2e-test-utils';

/**
 * WordPress dependencies
 */
import { activatePlugin, deactivatePlugin } from '@wordpress/e2e-test-utils';

describe('Site Kit integration with dashboard', () => {
  withUser('admin', 'password');

  it('should be able see Site Kit specific message for Google Analytics', async () => {
    await activatePlugin('e2e-tests-site-kit-analytics-mock');
    await visitSettings();

    await expect(page).toMatch(
      'Site Kit by Google has already enabled Google Analytics for your Web Stories'
    );
    await deactivatePlugin('e2e-tests-site-kit-analytics-mock');
  });

  it('should be able see Site Kit specific message for Google AdSense', async () => {
    await activatePlugin('e2e-tests-site-kit-adsense-mock');
    await visitSettings();

    await expect(page).toMatch(
      'Site Kit by Google has already enabled Google AdSense for your Web Stories'
    );
    await deactivatePlugin('e2e-tests-site-kit-adsense-mock');
  });
});
