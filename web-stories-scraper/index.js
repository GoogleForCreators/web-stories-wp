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

import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import { existsSync, readFileSync } from 'fs';
import scrape from 'website-scraper';
import SaveToExistingDirectoryPlugin from 'website-scraper-existing-directory';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

const directory = args[0] ? join(__dirname, args[0]) : undefined;

if (!directory || !existsSync(directory)) {
  console.log('Target directory was not provided.');
  process.exit(1);
}

const urls = readFileSync('./stories.txt', 'utf8').split('\n').filter(Boolean);

const noun = urls.length === 1 ? 'story' : 'stories';
console.log(
  `Downloading ${urls.length} ${noun} and saving to '${relative(
    __dirname,
    directory
  )}'`
);

const options = {
  urls,
  directory,
  sources: [
    { selector: 'amp-story', attr: 'publisher-logo-src' },
    { selector: 'amp-story', attr: 'poster-portrait-src' },
    { selector: 'amp-img', attr: 'src' },
    { selector: 'amp-img', attr: 'srcset' },
    { selector: 'amp-video', attr: 'poster' },
    { selector: 'amp-video > source', attr: 'src' },
  ],
  subdirectories: [
    {
      directory: 'assets',
      extensions: ['.jpg', '.png', '.svg', '.webp', '.mp4'],
    },
  ],
  filenameGenerator: 'bySiteStructure',
  plugins: [new SaveToExistingDirectoryPlugin()],
};

const result = await scrape(options);

for (const { url, filename } of result) {
  console.log(
    `Downloaded ${url} to ${relative(__dirname, join(directory, filename))}`
  );
}
