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
import { getAMPValidationErrors } from '@web-stories-wp/jest-amp';

/** @typedef {import('puppeteer').Page} Page */
/** @typedef {import('jest').CustomMatcherResult} CustomMatcherResult */

/**
 * Whether a given URL is valid AMP or not.
 *
 * Opens the URL in a new incognito page, retrieves the
 * page's content and then runs it through the AMP validator.
 *
 * @param {string} url The URL to validate.
 * @return {CustomMatcherResult} Matcher result.
 */
async function toBeValidAMP(url) {
  const context = await browser.createIncognitoBrowserContext();
  const incognitoPage = await context.newPage();
  const response = await incognitoPage.goto(url);
  const content = await response.text();
  await incognitoPage.close();
  await context.close();

  const errors = await getAMPValidationErrors(content, true);
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
