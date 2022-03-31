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
 * Returns font metrics for a given public font URL.
 *
 * @param {string} fontURL Public font URL.
 * @return {Object} Font data, including metrics, name.
 */
async function getFontDataFromUrl(fontURL) {
  const { load } = await import(
    /* webpackChunkName: "chunk-opentype" */ 'opentype.js'
  );
  const fontInfo = await load(fontURL);

  return {
    name: fontInfo.names.fullName.en,
    family: fontInfo.names.fullName.en,
    weights: [400],
    styles: ['regular'],
    variants: [[0, 400]],
    service: 'custom',
    fallbacks: ['sans-serif'],
    metrics: {
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
    },
  };
}

export default getFontDataFromUrl;
