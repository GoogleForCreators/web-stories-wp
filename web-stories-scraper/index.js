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

import { fileURLToPath, URL } from 'url';
import { dirname, join, relative, extname, basename, resolve } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

import scrape from 'website-scraper';
import SaveToExistingDirectoryPlugin from 'website-scraper-existing-directory';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

const url = args[0] ? args[0] : undefined;
const directory = args[1] ? resolve(args[1]) : undefined;

if (!url) {
  console.log('Story URL was not provided');
  process.exit(1);
}

if (!directory) {
  console.log('Target directory was not provided.');
  process.exit(1);
}

if (!existsSync(directory)) {
  mkdirSync(directory);
}

const WEBSITE_LOCATION = 'https://wp.stories.google/stories/';

/* eslint-disable no-irregular-whitespace */
const ADDITIONAL_ANALYTICS = `
<amp-analytics type="gtag" data-credentials="include">
 <script type="application/json">
   {
     "vars": {
       "gtag_id": "UA-174115079-1",
       "config": {
         "UA-174115079-1": {
           "groups": "default"
         }
       }
     },
     "triggers": {
       "storyProgress": {
         "on": "story-page-visible",
         "vars": {
           "event_name": "custom",
           "event_action": "story_progress",
           "event_category": "\${title}",
           "event_label": "\${storyPageId}",
           "send_to": ["UA-174115079-1"]
         }
       },
       "storyEnd": {
         "on": "story-last-page-visible",
         "vars": {
           "event_name": "custom",
           "event_action": "story_complete",
           "event_category": "\${title}",
           "send_to": ["UA-174115079-1"]
         }
       }
     }
   }
 </script>
</amp-analytics>`;
/* eslint-enable no-irregular-whitespace */

console.log(
  `Downloading story and saving to '${relative(__dirname, directory)}'`
);

class WebStoriesScraperPlugin {
  apply(registerAction) {
    let defaultFilename;
    let subdirectories;
    let storyPath = '';

    registerAction('beforeStart', ({ options }) => {
      defaultFilename = options.defaultFilename;
      subdirectories = options.subdirectories;
    });

    registerAction('generateFilename', ({ resource }) => {
      const parsedURL = new URL(resource.getUrl());
      const urlPath = basename(parsedURL.pathname);
      // TODO: For Unsplash images, take URL query params into account.
      let filename = resource.getFilename() || urlPath || defaultFilename;

      if (resource.isHtml()) {
        storyPath = urlPath;
      }

      if (resource.isHtml()) {
        filename = join(urlPath, filename);
      } else {
        let fileExtension = extname(filename);
        // Especially Unsplash images do not have an extension.
        if (!fileExtension) {
          fileExtension = '.jpg';
        }

        const directoryByExtension =
          subdirectories
            .filter((dir) => dir.extensions.includes(fileExtension))
            .map((dir) => dir.directory)
            .shift() || '';

        filename = join(storyPath, directoryByExtension, filename);
      }

      return {
        filename,
      };
    });

    // Clean up resulting HTML file.
    registerAction('onResourceSaved', ({ resource }) => {
      if (resource.isHtml()) {
        const parsedURL = new URL(resource.getUrl());
        const urlPath = basename(parsedURL.pathname);
        const filePath = join(directory, resource.getFilename());

        let fileContents = readFileSync(filePath, 'utf-8');
        fileContents = fileContents
          // Remove some clutter.
          .replace(
            /<link rel="(EditURI|wlwmanifest|prev|next|shortlink|alternate)"[^>]+>\s?/gm,
            ''
          )
          .replace(/<link rel="https:\/\/api\.w\.org\/"[^>]+>/gm, '')
          // Remove noindex.
          .replace('<meta name="robots" content="noindex,nofollow">', '')
          // Full URLs for twitter and Open Graph images.
          .replace(
            /<meta property="twitter:image" content="([^>]+)">/gm,
            (match, p1) =>
              `<meta property="twitter:image" content="${WEBSITE_LOCATION}${urlPath}/${p1}">`
          )
          .replace(
            /<meta property="og:image" content="([^>]+)">/gm,
            (match, p1) =>
              `<meta property="og:image" content="${WEBSITE_LOCATION}${urlPath}/${p1}">`
          )
          // Full URLs for story poster & publisher logo.
          .replace(
            'publisher-logo-src="',
            `publisher-logo-src="${WEBSITE_LOCATION}${urlPath}/`
          )
          .replace(
            'poster-portrait-src="',
            `poster-portrait-src="${WEBSITE_LOCATION}${urlPath}/`
          )
          .replace(
            'poster-landscape-src="',
            `poster-landscape-src="${WEBSITE_LOCATION}${urlPath}/`
          )
          .replace(
            'poster-square-src="',
            `poster-square-src="${WEBSITE_LOCATION}${urlPath}/`
          )
          // Full URLs for video tracks.
          .replace(
            /src="tracks\//g,
            `src="${WEBSITE_LOCATION}${urlPath}/tracks/`
          )
          // Full URLs for link[rel=canonical].
          .replace(
            '<link rel="canonical" href="index.html">',
            `<link rel="canonical" href="${WEBSITE_LOCATION}${urlPath}/">`
          )
          // Fix schema data.
          .replace(
            /<script type="application\/ld\+json">(.*)<\/script>/gm,
            (match, p1) => {
              const metadata = JSON.parse(p1);
              if (metadata.image) {
                metadata.image =
                  `${WEBSITE_LOCATION}${urlPath}/` +
                  fileContents.match(/poster-portrait-src="([^"]+)"/)[1];
              }
              if (metadata.publisher.logo) {
                metadata.publisher.logo.url =
                  `${WEBSITE_LOCATION}${urlPath}/` +
                  fileContents.match(/publisher-logo-src="([^"]+)"/)[1];
              }
              metadata.mainEntityOfPage = `${WEBSITE_LOCATION}${urlPath}`;
              return `<script type="application/ld+json">${JSON.stringify(
                metadata
              )}</script>`;
            }
          )
          // Workaround for https://github.com/website-scraper/node-website-scraper/issues/355.
          .replace(
            /font-family:([^;]+)/gm,
            (match, p1) => `font-family:${p1.replace(/"/gm, "'")}`
          )
          // Additional analytics for testing.
          .replace(
            '</amp-analytics>',
            '</amp-analytics>' + ADDITIONAL_ANALYTICS
          );

        writeFileSync(filePath, fileContents);
      }
    });
  }
}

const options = {
  urls: [url],
  directory,
  sources: [
    { selector: 'amp-story', attr: 'publisher-logo-src' },
    { selector: 'amp-story', attr: 'poster-portrait-src' },
    { selector: 'amp-story', attr: 'poster-landscape-src' },
    { selector: 'amp-story', attr: 'poster-square-src' },
    { selector: 'amp-img', attr: 'src' },
    { selector: 'amp-img', attr: 'srcset' },
    { selector: 'amp-video', attr: 'poster' },
    { selector: 'amp-video', attr: 'artwork' },
    { selector: 'amp-video > source', attr: 'src' },
    { selector: 'meta[property="og:url"]', attr: 'content' },
    { selector: 'meta[property="og:image"]', attr: 'content' },
    { selector: 'meta[property="twitter:image"]', attr: 'content' },
    { selector: 'link[rel="canonical"]', attr: 'href' },
    { selector: 'track', attr: 'src' },
  ],
  subdirectories: [
    {
      directory: 'assets',
      extensions: ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif', '.mp4'],
    },
    {
      directory: 'tracks',
      extensions: ['.vtt'],
    },
  ],
  plugins: [new SaveToExistingDirectoryPlugin(), new WebStoriesScraperPlugin()],
};

const result = await scrape(options);

for (const { url: _url, filename } of result) {
  console.log(
    `Downloaded ${_url} to ${relative(__dirname, join(directory, filename))}`
  );
}
