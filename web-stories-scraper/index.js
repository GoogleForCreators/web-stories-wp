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
import { dirname, join, relative, extname, basename } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

import scrape from 'website-scraper';
import SaveToExistingDirectoryPlugin from 'website-scraper-existing-directory';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

const url = args[0] ? args[0] : undefined;
const directory = args[1] ? join(__dirname, args[1]) : undefined;

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
      let filename = resource.getFilename() || urlPath || defaultFilename;
      const fileExtension = extname(filename);

      if (resource.isHtml()) {
        storyPath = urlPath;
      }

      if (resource.isHtml()) {
        filename = join(urlPath, filename);
      } else {
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
        const filePath = join(directory, resource.getFilename());

        writeFileSync(
          filePath,
          readFileSync(filePath, 'utf-8')
            // Remove some clutter.
            .replace(
              /<link rel="(EditURI|wlwmanifest|prev|next|shortlink|alternate)"[^>]+>\s?/gm,
              ''
            )
            .replace(/<link rel="https:\/\/api\.w\.org\/"[^>]+>/gm, '')
            // Fix for https://github.com/website-scraper/node-website-scraper/issues/355.
            .replace(/font-family:"([^,]+)"/gm, `font-family:'$1'`)
        );
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
  ],
  subdirectories: [
    {
      directory: 'assets',
      extensions: ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif', '.mp4'],
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
