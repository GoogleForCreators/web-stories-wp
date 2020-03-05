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
import getUsedAmpExtensions from './getUsedAmpExtensions';
import Boilerplate from './ampBoilerplate';
import CustomCSS from './styles';
import { OutputPage } from './';

function OutputStory({
  story,
  pages,
  metadata: { publisher, fallbackPoster },
}) {
  const ampExtensions = getUsedAmpExtensions(pages);
  return (
    <html amp="" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        {ampExtensions.map(({ name, src }) => (
          <script key={src} async="async" src={src} custom-element={name} />
        ))}
        <Boilerplate />
        <CustomCSS />
        {/* Everything between these markers can be replaced server-side. */}
        <meta name="web-stories-replace-head-start" />
        <link rel="canonical" href={story.link} />
        <meta name="web-stories-replace-head-end" />
      </head>
      <body>
        <amp-story
          standalone="standalone"
          publisher={publisher.name}
          publisher-logo-src={publisher.logo}
          title={story.title}
          poster-portrait-src={story.posterPortraitUrl || fallbackPoster}
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
    publisher: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
    }),
    fallbackPoster: PropTypes.string.isRequired,
  }).isRequired,
};

export default OutputStory;
