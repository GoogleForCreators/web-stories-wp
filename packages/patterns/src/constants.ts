/*
 * Copyright 2021 Google LLC
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
import { PatternType, type Linear } from './types';

export const DEFAULT_GRADIENT: Linear = {
  type: PatternType.Linear,
  stops: [
    {
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
      position: 0,
    },
    {
      color: {
        r: 1,
        g: 1,
        b: 1,
      },
      position: 1,
    },
  ],
};

export const GRADIENT = {
  LINEAR: 'linear-gradient',
  RADIAL: 'radial-gradient',
};

export const GRADIENT_REGEX = {
  [GRADIENT.LINEAR]:
    /linear-gradient\((?:-?\d*\.?\d+turn,\s*)?(?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*0%,\s*(?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*100%\)/,
  [GRADIENT.RADIAL]:
    /radial-gradient\((?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*0%,\s*(?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*100%\)/,
};
