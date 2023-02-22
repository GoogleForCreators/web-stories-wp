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
import { join } from 'path';

/**
 * Internal dependencies
 */
import createURL from './createURL';
import isCurrentURL from './isCurrentURL';

const REGEXP_PHP_ERROR =
  /(<b>)?(Fatal error|Recoverable fatal error|Warning|Parse error|Notice|Strict Standards|Deprecated|Unknown error)(<\/b>)?: (.*?) in (.*?) on line (<b>)?\d+(<\/b>)?/;

async function getPageError() {
  const content = await page.content();
  const match = content.match(REGEXP_PHP_ERROR);
  return match ? match[0] : null;
}

/**
 * Visits admin page/
 *
 * @param {string} adminPath String to be serialized as pathname.
 * @param {string} [query] String to be serialized as query portion of URL.
 * @param {string} [hash] Location hash string, e.g. "/editor-settings".
 */
async function visitAdminPage(adminPath, query = '', hash = '') {
  const targetUrl =
    createURL(join('wp-admin', adminPath), query) + (hash ? `#${hash}` : '');

  if (isCurrentURL(targetUrl)) {
    return;
  }

  await page.goto(targetUrl);

  // Handle upgrade required screen
  if (isCurrentURL('wp-admin/upgrade.php')) {
    // Click update
    await page.click('.button.button-large.button-primary');
    // Click continue
    await page.click('.button.button-large');
  }

  const error = await getPageError();
  if (error) {
    throw new Error('Unexpected error in page content: ' + error);
  }
}

export default visitAdminPage;
