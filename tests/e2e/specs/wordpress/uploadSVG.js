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
 * WordPress dependencies
 */
import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import { percySnapshot } from '@percy/puppeteer';

/**
 * Internal dependencies
 */
import { withExperimentalFeatures } from '../../utils';

describe('SVG Upload', () => {
  withExperimentalFeatures(['enableSVG']);
  it('upload svg via media library.', async () => {
    await visitAdminPage('media-new.php');

    const elementHandle = await page.$('#html-upload-ui #async-upload');
    await elementHandle.uploadFile('../../assets/arrow.svg');
    await expect(page).toClick('#html-upload');

    await page.waitForNavigation();

    await percySnapshot(page, 'SVG uploaded');
    await expect(page).toMatchElement('.attachment[aria-label="arrow"]');
  });
});
