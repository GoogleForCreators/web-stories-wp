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

const MIGRATIONS = {
  1: [storyDataArrayToObject],
  2: [dataPixelTo1080],
  3: [fullbleedToFill],
  4: [squareToShape, mediaElementToResource],
  5: [setOpacity],
  6: [colorToPattern],
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
