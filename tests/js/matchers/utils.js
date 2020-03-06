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
import amphtmlValidator from 'amphtml-validator';

// eslint-disable-next-line react/prop-types
function WrapElement({ children }) {
  return (
    <WrapPage>
      <amp-story-page id="foo">
        <amp-story-grid-layer template="vertical">
          {children}
        </amp-story-grid-layer>
      </amp-story-page>
    </WrapPage>
  );
}

// eslint-disable-next-line react/prop-types
function WrapPage({ children }) {
  return (
    <WrapStory>
      <amp-story
        standalone="standalone"
        publisher="Example Publisher"
        publisher-logo-src="https://example.com/publisher.png"
        title="Example Story"
        poster-portrait-src="https://example.com/poster.png"
      >
        {children}
      </amp-story>
    </WrapStory>
  );
}

// eslint-disable-next-line react/prop-types
function WrapStory({ children }) {
  return (
    <html amp="" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        <script async="async" src="https://cdn.ampproject.org/v0.js" />
        <script
          async="async"
          src="https://cdn.ampproject.org/v0/amp-story-1.0.js"
          custom-element="amp-story"
        />
        <script
          async="async"
          src="https://cdn.ampproject.org/v0/amp-video-0.1.js"
          custom-element="amp-video"
        />
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
        <link rel="canonical" href="https://example.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}

async function getAMPValidationErrors(stringOrComponent) {
  const string = renderToStaticMarkup(stringOrComponent);
  const completeString = '<!DOCTYPE html>' + string;
  const validator = await amphtmlValidator.getInstance();
  const { errors } = validator.validateString(completeString);

  const errorMessages = [];

  for (const err of errors) {
    const { message, specUrl } = err;

    const msg = specUrl ? `${message} (see ${specUrl})` : message;

    errorMessages.push(msg);
  }

  return errorMessages;
}

export { WrapElement, WrapPage, WrapStory, getAMPValidationErrors };
