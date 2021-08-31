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
import { dirname, resolve } from 'path';
import { createWriteStream, readdirSync } from 'fs';

import { Readable } from 'stream';
import { SitemapStream } from 'sitemap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOSTNAME = 'https://wp.stories.google';

const args = process.argv.slice(2);
const targetFile = args[0] ? resolve(args[0]) : undefined;

const stories = readdirSync(resolve(__dirname, '..', 'public', 'stories')).map(
  (slug) => ({ url: `/stories/${slug}/` })
);

const links = [{ url: '/' }, { url: '/docs/' }, ...stories];

const stream = new SitemapStream({ hostname: HOSTNAME });

Readable.from(links).pipe(stream).pipe(createWriteStream(targetFile));

console.log('Generated XML sitemap!');
