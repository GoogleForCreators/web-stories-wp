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
 * Appends search params to the provided URL.
 *
 * @param {string} url  URL to be modified.
 * @param {Object} args Query arguments to apply to URL.
 * @example
 * ```js
 * const newURL = addQueryArgs( 'https://google.com', { q: 'test' } ); // https://google.com/?q=test
 * ```
 * @return {string} URL with arguments applied.
 */
export default function addQueryArgs(url, args) {
  let isRelativeUrl = false;
  let parsedURL;

  try {
    parsedURL = new URL(url);
  } catch {
    parsedURL = new URL(url, document.location.href);
    isRelativeUrl = true;
  }

  for (const key in args) {
    if (!Object.prototype.hasOwnProperty.call(args, key)) {
      continue;
    }

    const value = args[key];

    if (typeof value !== 'undefined' && value !== null) {
      parsedURL.searchParams.set(key, value);
    }
  }

  return isRelativeUrl ? parsedURL.pathname + parsedURL.search : parsedURL.href;
}
