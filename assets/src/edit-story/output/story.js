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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../types';
import { OutputPage } from './index';

function OutputStory({ story, pages, metadata }) {
  return (
    <html amp lang="en">
      <head>
        <script async="" src="https://cdn.ampproject.org/v0.js" />
        <script
          async=""
          src="https://cdn.ampproject.org/v0/amp-story-1.0.js"
          custom-element="amp-story"
        />
      </head>
      <body>
        <amp-story
          standalone="standalone"
          publisher={metadata.publisher}
          publisher-logo-src={metadata.publisherLogo}
          title={story.title}
          poster-portrait-src={story.featuredMediaUrl}
          poster-square-src={story.featuredMediaUrl}
          poster-landscape-src={story.featuredMediaUrl}
        >
          {pages.map((page) => (
            <OutputPage key={page.id} page={page} />
          ))}
        </amp-story>
      </body>
    </html>
  );
}

OutputStory.propTypes = {
  story: StoryPropTypes.story.isRequired,
  pages: PropTypes.arrayOf(StoryPropTypes.page).isRequired,
  metadata: PropTypes.shape({
    publisher: PropTypes.string.isRequired,
    publisherLogo: PropTypes.string.isRequired,
  }).isRequired,
};

export default OutputStory;
