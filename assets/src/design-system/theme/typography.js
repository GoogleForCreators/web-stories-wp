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

import { PRESET_SIZES } from './constants/typography';

// sizes are in px but unit is left off in case calculations are necessary
const themeFonts = {
  primary: "'Google Sans', sans-serif",
};

export const typography = {
  family: { ...themeFonts },
  weight: {
    bold: 500,
    regular: 400,
    light: 300,
  },
  presets: {
    display: {
      [PRESET_SIZES.LARGE]: {
        weight: 700,
        size: 122,
        lineHeight: 124,
        letterSpacing: -2.4,
      },
      [PRESET_SIZES.MEDIUM]: {
        weight: 700,
        size: 58,
        lineHeight: 64,
        letterSpacing: -1.4,
      },
      [PRESET_SIZES.SMALL]: {
        weight: 700,
        size: 36,
        lineHeight: 40,
        letterSpacing: -1,
      },
    },
    headline: {
      [PRESET_SIZES.XX_LARGE]: {
        weight: 500,
        size: 42,
        lineHeight: 56,
        letterSpacing: 0,
      },
      [PRESET_SIZES.X_LARGE]: {
        weight: 500,
        size: 36,
        lineHeight: 44,
        letterSpacing: 0,
      },
      [PRESET_SIZES.LARGE]: {
        weight: 500,
        size: 32,
        lineHeight: 40,
        letterSpacing: 0,
      },
      [PRESET_SIZES.MEDIUM]: {
        weight: 500,
        size: 28,
        lineHeight: 36,
        letterSpacing: 0,
      },
      [PRESET_SIZES.SMALL]: {
        weight: 500,
        size: 24,
        lineHeight: 32,
        letterSpacing: 0,
      },
      [PRESET_SIZES.X_SMALL]: {
        weight: 500,
        size: 20,
        lineHeight: 24,
        letterSpacing: 0,
      },
      [PRESET_SIZES.XX_SMALL]: {
        weight: 500,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
    },
    text: {
      [PRESET_SIZES.X_LARGE]: {
        weight: 400,
        size: 24,
        lineHeight: 32,
        letterSpacing: -0.02,
      },
      [PRESET_SIZES.LARGE]: {
        weight: 400,
        size: 18,
        lineHeight: 24,
        letterSpacing: 0,
      },
      [PRESET_SIZES.MEDIUM]: {
        weight: 400,
        size: 16,
        lineHeight: 24,
        letterSpacing: 0,
      },
      [PRESET_SIZES.SMALL]: {
        weight: 400,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
      [PRESET_SIZES.X_SMALL]: {
        weight: 400,
        size: 12,
        lineHeight: 20,
        letterSpacing: 0.16,
      },
    },
    button: {
      [PRESET_SIZES.MEDIUM]: {
        weight: 500,
        size: 16,
        lineHeight: 24,
        letterSpacing: 0,
      },
      [PRESET_SIZES.SMALL]: {
        weight: 500,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
    },
    label: {
      [PRESET_SIZES.SMALL]: {
        weight: 400,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
    },
  },
};
