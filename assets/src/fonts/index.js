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

import {resolve} from 'path';
import buildFonts from './utils/buildFonts.js';

if (!process.env.GOOGLE_FONTS_API_KEY) {
  console.error('Google Fonts API key missing!');
  process.exit(1);
}

const FONTS_FILE = 'fonts.json';
const fontsFilePath = resolve(process.cwd(), FONTS_FILE);

try {
  await buildFonts(fontsFilePath);
} catch (err) {
  console.error('There was an error generating the web fonts list:', err);
  process.exit(1);
}

console.log('Web fonts updated!');
