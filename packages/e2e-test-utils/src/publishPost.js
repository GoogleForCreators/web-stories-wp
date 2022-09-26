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
import {
  arePrePublishChecksEnabled,
  openPublishPanel,
} from '@wordpress/e2e-test-utils';

/**
 * Custom helper function to publish posts in Gutenberg.
 *
 * Avoids using `disablePrePublishChecks`.
 *
 * The main reason for this is that it calls toggleScreenOption,
 * which itself is rather flaky and sometimes
 * doesn't find the requested element, causing JS errors.
 *
 * Also avoids using the original `publishPost` helper as it often
 * fails waiting for a snackbar message to appear.
 * Instead, we wait to receive the post's updated permalink.
 *
 * @see https://github.com/WordPress/gutenberg/blob/f96bd6b6fdfca02d47edce8c2f0d68dccf3a37be/packages/e2e-test-utils/src/toggle-screen-option.js#L20-L23
 * @return {Promise<string>} The post's permalink.
 */
async function publishPost() {
  // Increase timeout to stop publishing post failing this test.
  await page.setDefaultTimeout(10000);
  const prePublishChecksEnabled = await arePrePublishChecksEnabled();

  if (prePublishChecksEnabled) {
    await openPublishPanel();

    // Wait for the panel to fully slide in.
    await page.waitForTimeout(500);
  }

  // Publish the post
  await page.click('.editor-post-publish-button');

  // Wait until the selector returns a truthy value.
  await page.waitForFunction(
    () =>
      wp.data.select('core/editor').getEditedPostAttribute('status') ===
      'publish'
  );
  await page.setDefaultTimeout(3000);

  await expect(page).toMatchElement('a', { text: 'View Post' });

  return page.evaluate(() => wp.data.select('core/editor').getPermalink());
}

export default publishPost;
