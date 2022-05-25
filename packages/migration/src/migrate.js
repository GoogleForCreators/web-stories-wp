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
 * Internal dependencies
 */
import storyDataArrayToObject from './migrations/v0001_storyDataArrayToObject';
import dataPixelTo1080 from './migrations/v0002_dataPixelTo1080';
import fullbleedToFill from './migrations/v0003_fullbleedToFill';
import squareToShape from './migrations/v0004_squareToShape';
import mediaElementToResource from './migrations/v0004_mediaElementToResource';
import setOpacity from './migrations/v0005_setOpacity';
import colorToPattern from './migrations/v0006_colorToPattern';
import setFlip from './migrations/v0007_setFlip';
import paddingToObject from './migrations/v0008_paddingToObject';
import defaultBackground from './migrations/v0009_defaultBackground';
import dataPixelTo440 from './migrations/v0010_dataPixelTo440';
import pageAdvancement from './migrations/v0011_pageAdvancement';
import setBackgroundTextMode from './migrations/v0012_setBackgroundTextMode';
import videoIdToId from './migrations/v0013_videoIdToId';
import oneTapLinkDeprecate from './migrations/v0014_oneTapLinkDeprecate';
import fontObjects from './migrations/v0015_fontObjects';
import isFullBleedDeprecate from './migrations/v0016_isFullbleedDeprecate';
import inlineTextProperties from './migrations/v0017_inlineTextProperties';
import defaultBackgroundElement from './migrations/v0018_defaultBackgroundElement';
import conicToLinear from './migrations/v0019_conicToLinear';
import isFillDeprecate from './migrations/v0020_isFillDeprecate';
import backgroundColorToPage from './migrations/v0021_backgroundColorToPage';
import dataPixelTo412 from './migrations/v0022_dataPixelTo412';
import convertOverlayPattern from './migrations/v0023_convertOverlayPattern';
import blobsToSingleBlob from './migrations/v0024_blobsToSingleBlob';
import singleAnimationTarget from './migrations/v0025_singleAnimationTarget';
import backgroundOverlayToOverlay from './migrations/v0026_backgroundOverlayToOverlay';
import videoDuration from './migrations/v0027_videoDuration';
import mark3pVideoAsOptimized from './migrations/v0028_mark3pVideoAsOptimized';
import unifyGifResources from './migrations/v0029_unifyGifResources';
import mark3pVideoAsMuted from './migrations/v0030_mark3pVideoAsMuted';
import normalizeResourceSizes from './migrations/v0031_normalizeResourceSizes';
import pageOutlinkTheme from './migrations/v0032_pageOutlinkTheme';
import removeTitleFromResources from './migrations/v0033_removeTitleFromResources';
import removeUnusedBackgroundProps from './migrations/v0034_removeUnusedBackgroundProps';
import markVideoAsExternal from './migrations/v0035_markVideoAsExternal';
import changeBaseColorToHex from './migrations/v0036_changeBaseColorToHex';
import removeTransientMediaProperties from './migrations/v0037_removeTransientMediaProperties';
import camelCaseResourceSizes from './migrations/v0038_camelCaseResourceSizes';
import backgroundAudioFormatting from './migrations/v0039_backgroundAudioFormatting';
import andadaFontToAndadaPro from './migrations/v0040_andadaFontToAndadaPro.js';
import removeFontProperties from './migrations/v0041_removeFontProperties.js';
import removeTrackName from './migrations/v0042_removeTrackName.js';
import removeTagNames from './migrations/v0043_removeTagNames';

const MIGRATIONS = {
  1: [storyDataArrayToObject],
  2: [dataPixelTo1080],
  3: [fullbleedToFill],
  4: [squareToShape, mediaElementToResource],
  5: [setOpacity],
  6: [colorToPattern],
  7: [setFlip],
  8: [paddingToObject],
  9: [defaultBackground],
  10: [dataPixelTo440],
  11: [pageAdvancement],
  12: [setBackgroundTextMode],
  13: [videoIdToId],
  14: [oneTapLinkDeprecate],
  15: [fontObjects],
  16: [isFullBleedDeprecate],
  17: [inlineTextProperties],
  18: [defaultBackgroundElement],
  19: [conicToLinear],
  20: [isFillDeprecate],
  21: [backgroundColorToPage],
  22: [dataPixelTo412],
  23: [convertOverlayPattern],
  24: [blobsToSingleBlob],
  25: [singleAnimationTarget],
  26: [backgroundOverlayToOverlay],
  27: [videoDuration],
  28: [mark3pVideoAsOptimized],
  29: [unifyGifResources],
  30: [mark3pVideoAsMuted],
  31: [normalizeResourceSizes],
  32: [pageOutlinkTheme],
  33: [removeTitleFromResources],
  34: [removeUnusedBackgroundProps],
  35: [markVideoAsExternal],
  36: [changeBaseColorToHex],
  37: [removeTransientMediaProperties],
  38: [camelCaseResourceSizes],
  39: [backgroundAudioFormatting],
  40: [andadaFontToAndadaPro],
  41: [removeFontProperties],
  42: [removeTrackName],
  43: [removeTagNames],
};

export const DATA_VERSION = Math.max.apply(
  null,
  Object.keys(MIGRATIONS).map(Number)
);

export function migrate(storyData, version) {
  let result = storyData;
  for (let v = version; v < DATA_VERSION; v++) {
    const migrations = MIGRATIONS[v + 1];
    if (!migrations) {
      continue;
    }
    for (const i in migrations) {
      if (Object.prototype.hasOwnProperty.call(migrations, i)) {
        result = migrations[Number(i)](result);
      }
    }
  }
  return result;
}

export default migrate;
