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
 * Internal dependencies
 */
import { getAMPValidationErrors } from '../../js/matchers/utils';

/** @typedef {import('puppeteer').Page} Page */
/** @typedef {import('jest').CustomMatcherResult} CustomMatcherResult */

/**
 * Whether the current page is valid AMP or not.
 *
 * @param {Page} page The page object.
 * @return {CustomMatcherResult} Matcher result.
 */
async function toBeValidAMP(page) {
  const errors = await getAMPValidationErrors(await page.content(), true);
  const pass = errors.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? `Expected page not to be valid AMP.`
        : `Expected page to be valid AMP. Errors:\n${errors.join('\n')}`,
  };
}

export default toBeValidAMP;
