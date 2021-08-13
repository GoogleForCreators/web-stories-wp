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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import OutputStory from '../story';

/**
 * Creates AMP HTML markup for saving to DB for rendering in the FE.
 *
 * @param {import('../../../types').Story} story Story object.
 * @param {Array<Object>} pages List of pages.
 * @param {Object} metadata Metadata.
 * @return {string} Story markup.
 */
export default function getStoryMarkup(story, pages, metadata) {
  /* eslint-disable no-console */
  const originalConsoleError = console.error;
  console.error = function (error, ...args) {
    if (
      error &&
      !error.startsWith('Warning: useLayoutEffect does nothing on the server')
    ) {
      originalConsoleError(error, ...args);
    }
  };
  const markup = renderToStaticMarkup(
    <OutputStory story={story} pages={pages} metadata={metadata} />
  );

  console.error = originalConsoleError;
  /* eslint-enable no-console */

  return markup;
}
