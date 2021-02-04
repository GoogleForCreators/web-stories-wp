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
import { FlagsProvider } from 'flagged';

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
 * @param {Object} featureFlags Boolean flags to enable/disable features
 * @return {string} Story markup.
 */
export default function getStoryMarkup(story, pages, metadata, featureFlags) {
  // Note that react-dom/server will warn about useLayoutEffect usage here.
  // Not because of any wrongdoing in our code, but mostly because
  // of its own profiler.
  // See https://github.com/facebook/react/issues/14927
  return renderToStaticMarkup(
    <FlagsProvider features={featureFlags}>
      <OutputStory story={story} pages={pages} metadata={metadata} />
    </FlagsProvider>
  );
}
