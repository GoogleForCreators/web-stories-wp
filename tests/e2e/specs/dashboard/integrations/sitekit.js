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
 * WordPress dependencies
 */
import {
  activatePlugin,
  deactivatePlugin,
  visitAdminPage,
} from '@wordpress/e2e-test-utils';

describe('Site Kit integration with dashboard', () => {
  beforeAll(async () => {
    await activatePlugin('google-site-kit');
    await activatePlugin('e2e-tests-sitekit-mock');
  });

  afterAll(async () => {
    await deactivatePlugin('google-site-kit');
    await deactivatePlugin('e2e-tests-sitekit-mock');
  });

  it('should be able see sitekit message', async () => {
    await visitAdminPage(
      'edit.php',
      'post_type=web-story&page=stories-dashboard#/editor-settings'
    );

    await expect(page).toMatchElement('[data-testid="sitekit-message"]');

    await percySnapshot(page, 'Stories Dashboard with sitekit');
  });
});
