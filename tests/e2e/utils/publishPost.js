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
  publishPostWithPrePublishChecksDisabled,
  publishPost as _publishPost,
} from '@wordpress/e2e-test-utils';

/**
 * Custom helper function to publish posts in Gutenberg.
 *
 * Avoid using disablePrePublishChecks.
 *
 * The main reason for this is that it calls toggleScreenOption,
 * which itself is rather flaky and sometimes
 * doesn't find the requested element, causing JS errors.
 *
 * @see https://github.com/WordPress/gutenberg/blob/f96bd6b6fdfca02d47edce8c2f0d68dccf3a37be/packages/e2e-test-utils/src/toggle-screen-option.js#L20-L23
 *
 * @return {Promise<string>} The post's permalink.
 */
async function publishPost() {
  await page.setDefaultTimeout(10000);
  const prePublishChecksEnabled = await arePrePublishChecksEnabled();

  if (prePublishChecksEnabled) {
    await _publishPost();
  } else {
    await publishPostWithPrePublishChecksDisabled();
  }

  // Wait until the selector returns a truthy value.
  await page.waitForFunction(() =>
    wp.data.select('core/editor').getPermalink()
  );
  await page.setDefaultTimeout(3000);

  return page.evaluate(() => wp.data.select('core/editor').getPermalink());
}

export default publishPost;
