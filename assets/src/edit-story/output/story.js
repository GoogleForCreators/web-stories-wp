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

// todo: improve / move elsehwere.
const getUsedAmpExtensions = (pages) => {
  const extensions = [
    // runtime.
    { src: 'https://cdn.ampproject.org/v0.js' },
    {
      name: 'amp-story',
      src: 'https://cdn.ampproject.org/v0/amp-story-1.0.js',
    },
  ];

  for (const { elements } of pages) {
    for (const { type } of elements) {
      switch (type) {
        // Todo: eventually check for amp-fit-text if ever added.
        case 'video':
          extensions.push({
            name: 'amp-video',
            src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
          });
          break;
        default:
          break;
      }
    }
  }

  return [...new Set(extensions)];
};

function OutputStory({ story, pages, metadata }) {
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
          <script key={src} async="" src={src} custom-element={name} />
        ))}
        <style
          amp-boilerplate=""
          dangerouslySetInnerHTML={{
            __html:
              'body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}',
          }}
        />
        <noscript>
          <style
            amp-boilerplate=""
            dangerouslySetInnerHTML={{
              __html:
                'body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}',
            }}
          />
        </noscript>
        <meta name="web-stories-replace-head-start" />
        <style
          amp-custom=""
          dangerouslySetInnerHTML={{
            __html: `
              .page-background-area, .page-safe-area {
                position: absolute;
                overflow: hidden;
                margin: auto;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
              }

              .page-background-area img, .page-background-area video {
                object-fit: cover;
              }

              .wrapper {
                position: absolute;
                overflow: hidden;
              }

              .fill {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0;
              }
              `,
          }}
        />
        <meta name="web-stories-replace-head-end" />
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
