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
import { SYSTEM_FONTS } from './constants';
import normalizeFont from './normalizeFont';
import getFontMetrics from './getFontMetrics';
import type { RawFont } from './types';

const GOOGLE_WEB_FONTS_API = 'https://www.googleapis.com/webfonts/v1/webfonts';

/**
 * Main function to build the fonts list.
 *
 * @param targetFile Path to the target file to be written.
 */
async function buildFonts(targetFile: string) {
  const url = new URL(GOOGLE_WEB_FONTS_API);
  url.searchParams.append('fields', 'items');
  url.searchParams.append('prettyPrint', 'false');
  url.searchParams.append('key', process.env.GOOGLE_FONTS_API_KEY ?? '');

  const response = await fetch(url.toString());

  if (!response.ok) {
    return;
  }

  const rawFonts = (await response.json()) as { items: RawFont[] };

  if (!Object.prototype.hasOwnProperty.call(rawFonts, 'items')) {
    return;
  }

  const googleFonts = await Promise.all(
    rawFonts.items.map(async (font: RawFont) => {
      const normalizedFont = normalizeFont(font);

      const fontFileURL =
        font.files['regular'] ||
        font.files[400] ||
        font.files[Object.keys(font.files)[0]];

      let fontMetrics = {};
      try {
        fontMetrics = await getFontMetrics(fontFileURL);
      } catch (err) {
        // eslint-disable-next-line no-console -- Surface error for debugging.
        console.error(
          `Error loading font metrics for "${font.family}" (${fontFileURL})`,
          err
        );
      }

      process.stdout.write('.');

      return {
        ...normalizedFont,
        metrics: fontMetrics,
      };
    })
  );

  // Force newlines after the dots.
  process.stdout.write('\n');

  const fonts = [...SYSTEM_FONTS, ...googleFonts];
  fonts.sort((a, b) => a.family.localeCompare(b.family));

  writeFileSync(targetFile, JSON.stringify(fonts));
}

export default buildFonts;
