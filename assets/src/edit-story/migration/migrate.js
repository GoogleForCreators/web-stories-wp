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
import storyDataArrayToObject from './migrations/v0001_storyDataArrayToObject.js';
import dataPixelTo1080 from './migrations/v0002_dataPixelTo1080.js';
import fullbleedToFill from './migrations/v0003_fullbleedToFill.js';
import squareToShape from './migrations/v0004_squareToShape.js';
import mediaElementToResource from './migrations/v0004_mediaElementToResource.js';
import setOpacity from './migrations/v0005_setOpacity.js';
import colorToPattern from './migrations/v0006_colorToPattern.js';
import setFlip from './migrations/v0007_setFlip.js';
import paddingToObject from './migrations/v0008_paddingToObject.js';
import defaultBackground from './migrations/v0009_defaultBackground.js';
import dataPixelTo440 from './migrations/v0010_dataPixelTo440.js';
import pageAdvancement from './migrations/v0011_pageAdvancement.js';
import setBackgroundTextMode from './migrations/v0012_setBackgroundTextMode.js';
import videoIdToId from './migrations/v0013_videoIdToId.js';
import oneTapLinkDeprecate from './migrations/v0014_oneTapLinkDeprecate.js';
import fontObjects from './migrations/v0015_fontObjects.js';
import isFullBleedDeprecate from './migrations/v0016_isFullbleedDeprecate.js';
import inlineTextProperties from './migrations/v0017_inlineTextProperties.js';
import defaultBackgroundElement from './migrations/v0018_defaultBackgroundElement.js';
import conicToLinear from './migrations/v0019_conicToLinear.js';
import isFillDeprecate from './migrations/v0020_isFillDeprecate.js';

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
    for (let i = 0; i < migrations.length; i++) {
      result = migrations[i](result);
    }
  }
  return result;
}

export default migrate;
