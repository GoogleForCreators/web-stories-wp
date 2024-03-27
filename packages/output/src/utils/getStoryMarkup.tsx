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
import type { Page } from '@googleforcreators/elements';
import { renderToStaticMarkup } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import OutputStory from '../story';
import type { Story, StoryMetadata } from '../types';

/**
 * Creates AMP HTML markup for saving to DB for rendering in the FE.
 *
 * @param story Story object.
 * @param pages List of pages.
 * @param metadata Metadata.
 * @param flags Feature flags.
 * @return Story markup.
 */
export default function getStoryMarkup(
  story: Story,
  pages: Page[],
  metadata: StoryMetadata,
  flags = {}
) {
  // Note that react-dom/server will warn about useLayoutEffect usage here.
  // Not because of any wrongdoing in our code, but mostly because
  // of its own profiler.
  // See https://github.com/facebook/react/issues/14927
  return renderToStaticMarkup(
    <OutputStory
      story={story}
      pages={pages}
      metadata={metadata}
      flags={flags}
    />
  );
}
