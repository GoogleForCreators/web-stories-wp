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
import { unlinkSync, writeFileSync } from 'node:fs';
import Crypto from 'node:crypto';
import { tmpdir } from 'node:os';
import Path from 'node:path';
import { loadSync } from 'opentype.js';

/**
 * Internal dependencies
 */
import type { FontMetrics } from './types';

/**
 * Returns a pseudo-random temporary file name.
 *
 * @return File name.
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
 * @param fontFileURL Font file URL.
 * @return Font metrics.
 */
async function getFontMetrics(fontFileURL: string) {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const response = await fetch(fontFileURL);

  const tempFile = getTmpFileName();
  writeFileSync(tempFile, Buffer.from(await response.arrayBuffer()));
  const fontInfo = loadSync(tempFile);
  unlinkSync(tempFile);

  return {
    upm: fontInfo.unitsPerEm,
    asc: fontInfo.ascender,
    des: fontInfo.descender,
    tAsc: fontInfo.tables.os2.sTypoAscender as number,
    tDes: fontInfo.tables.os2.sTypoDescender as number,
    tLGap: fontInfo.tables.os2.sTypoLineGap as number,
    wAsc: fontInfo.tables.os2.usWinAscent as number,
    wDes: fontInfo.tables.os2.usWinDescent as number,
    xH: fontInfo.tables.os2.sxHeight as number,
    capH: fontInfo.tables.os2.sCapHeight as number,
    yMin: fontInfo.tables.head.yMin as number,
    yMax: fontInfo.tables.head.yMax as number,
    hAsc: fontInfo.tables.hhea.ascender as number,
    hDes: fontInfo.tables.hhea.descender as number,
    lGap: fontInfo.tables.hhea.lineGap as number,
  } as FontMetrics;
}

export default getFontMetrics;
