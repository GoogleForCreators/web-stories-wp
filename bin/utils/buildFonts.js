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
import { writeFileSync } from 'fs';

/**
 * Internal dependencies
 */
import { SYSTEM_FONTS } from './constants.js';
import fetch from './fetch.js';
import normalizeFont from './normalizeFont.js';

const GOOGLE_WEB_FONTS_API = 'https://www.googleapis.com/webfonts/v1/webfonts';

/**
 * Main function to build the fonts list.
 *
 * @param {string} targetFile Path to the target file to be written.
 * @return {void}
 */
async function buildFonts(targetFile) {
  const url = new URL(GOOGLE_WEB_FONTS_API);
  url.searchParams.append('fields', 'items');
  url.searchParams.append('prettyPrint', 'false');
  url.searchParams.append('key', process.env.GOOGLE_FONTS_API_KEY);

  const rawData = await fetch(url.toString());
  if (!rawData.length) {
    return;
  }

  const googleFonts = JSON.parse(rawData);
  if (!Object.prototype.hasOwnProperty.call(googleFonts, 'items')) {
    return;
  }

  const fonts = [...SYSTEM_FONTS, ...googleFonts.items.map(normalizeFont)];

  fonts.sort((a, b) => a.family.localeCompare(b.family));

  writeFileSync(targetFile, JSON.stringify(fonts));
}

export default buildFonts;
