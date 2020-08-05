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
import { writeFileSync, unlinkSync } from 'fs';
import opentype from 'opentype.js';
import got from 'got';

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

  const tempFile = 'temp.ttf';
  for (let i = 0, n = fonts.length; i < n; i++) {
    const font = fonts[i];
    if (font.fontFileURL) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await got(font.fontFileURL);
        writeFileSync(tempFile, response.rawBody);
        const fontInfo = opentype.loadSync(tempFile);

        fonts[i].metrics = {
          upm: fontInfo.unitsPerEm,
          asc: fontInfo.ascender,
          des: fontInfo.descender,
          tAsc: fontInfo.tables.os2.sTypoAscender,
          tDes: fontInfo.tables.os2.sTypoDescender,
          tLGap: fontInfo.tables.os2.sTypoLineGap,
          wAsc: fontInfo.tables.os2.winAscent,
          wDes: fontInfo.tables.os2.winDescent,
          xH: fontInfo.tables.os2.sxHeight,
          capH: fontInfo.tables.os2.sCapHeight,
          yMin: fontInfo.tables.head.yMin,
          yMax: fontInfo.tables.head.yMax,
          hAsc: fontInfo.tables.hhea.ascender,
          hDes: fontInfo.tables.hhea.descender,
          lGap: fontInfo.tables.hhea.lineGap,
        };
        process.stdout.write('.');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(font.family, font.fontFileURL, error);
      }
    }
    delete font.fontFileURL;
  }
  unlinkSync(tempFile);

  fonts.sort((a, b) => a.family.localeCompare(b.family));

  writeFileSync(targetFile, JSON.stringify(fonts));
}

export default buildFonts;
