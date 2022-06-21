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
import { unlinkSync, writeFileSync } from 'fs';
import Crypto from 'crypto';
import { tmpdir } from 'os';
import Path from 'path';
import { loadSync } from 'opentype.js';

/**
 * @typedef {Object} FontMetrics font metrics.
 * @property {number} upm units per em.
 * @property {number} asc ascender.
 * @property {number} desc descender.
 * @property {number} tAsc sTypoAscender
 * @property {number} tDesc sTypoDescender.
 * @property {number} tLGap sTypoLineGap.
 * @property {number} wAsc usWinAscent.
 * @property {number} wDes usWinDescent.
 * @property {?number} xH sxHeight.
 * @property {?number} capH sCapHeight.
 * @property {number} yMin yMin.
 * @property {number} yMax yMax.
 * @property {number} hAsc ascender.
 * @property {number} hDes descender.
 * @property {number} lGap line gap.
 */

/**
 * Returns a pseudo-random temporary file name.
 *
 * @return {string} File name.
 */
function getTmpFileName() {
  return Path.join(
    tmpdir(),
    `font.${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.ttf`
  );
}

/**
 * Returns font metrics for a given external font file.
 *
 * @param {string} fontFileURL Font file URL.
 * @return {Promise<FontMetrics>} Font metrics.
 */
async function getFontMetrics(fontFileURL) {
  const response = await fetch(fontFileURL);

  const tempFile = getTmpFileName();
  writeFileSync(tempFile, Buffer.from(await response.arrayBuffer()));
  const fontInfo = loadSync(tempFile);
  unlinkSync(tempFile);

  return {
    upm: fontInfo.unitsPerEm,
    asc: fontInfo.ascender,
    des: fontInfo.descender,
    tAsc: fontInfo.tables.os2.sTypoAscender,
    tDes: fontInfo.tables.os2.sTypoDescender,
    tLGap: fontInfo.tables.os2.sTypoLineGap,
    wAsc: fontInfo.tables.os2.usWinAscent,
    wDes: fontInfo.tables.os2.usWinDescent,
    xH: fontInfo.tables.os2.sxHeight,
    capH: fontInfo.tables.os2.sCapHeight,
    yMin: fontInfo.tables.head.yMin,
    yMax: fontInfo.tables.head.yMax,
    hAsc: fontInfo.tables.hhea.ascender,
    hDes: fontInfo.tables.hhea.descender,
    lGap: fontInfo.tables.hhea.lineGap,
  };
}

export default getFontMetrics;
