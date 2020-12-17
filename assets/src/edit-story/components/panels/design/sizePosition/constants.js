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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../../constants';
import { DANGER_ZONE_HEIGHT } from '../../../../units/dimensions';

export const MIN_MAX = {
  // TODO: with %360 logic this is not used, but can be utilized via keyboard arrows
  ROTATION: {
    MIN: -360,
    MAX: 360,
  },
  WIDTH: {
    MIN: 1,
    MAX: 1000,
  },
  HEIGHT: {
    MIN: 1,
    MAX: 1000,
  },
  X: {
    MIN: 1,
    MAX: PAGE_WIDTH - 1,
  },
  Y: {
    MIN: 1 - Math.floor(DANGER_ZONE_HEIGHT),
    MAX: PAGE_HEIGHT + Math.floor(DANGER_ZONE_HEIGHT) - 1,
  },
};

export const DEFAULT_FLIP = { horizontal: false, vertical: false };
