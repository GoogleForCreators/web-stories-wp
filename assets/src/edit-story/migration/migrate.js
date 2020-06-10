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
