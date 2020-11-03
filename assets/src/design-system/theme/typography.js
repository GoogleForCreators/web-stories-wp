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

// sizes are in px but unit is left off in case calculations are necessary
const themeFonts = {
  primary: "'Google Sans', sans-serif",
};

export const TYPOGRAPHY_PRESET_SIZES = {
  XX_LARGE: 'xxlarge',
  X_LARGE: 'xlarge',
  LARGE: 'large',
  MEDIUM: 'medium',
  SMALL: 'small',
  X_SMALL: 'xsmall',
  XX_SMALL: 'xxsmall',
};

export const TEXT_SIZES = [
  TYPOGRAPHY_PRESET_SIZES.X_LARGE,
  TYPOGRAPHY_PRESET_SIZES.LARGE,
  TYPOGRAPHY_PRESET_SIZES.MEDIUM,
  TYPOGRAPHY_PRESET_SIZES.SMALL,
  TYPOGRAPHY_PRESET_SIZES.X_SMALL,
];

export const DISPLAY_SIZES = [
  TYPOGRAPHY_PRESET_SIZES.LARGE,
  TYPOGRAPHY_PRESET_SIZES.MEDIUM,
  TYPOGRAPHY_PRESET_SIZES.SMALL,
];

export const HEADLINE_SIZES = [
  TYPOGRAPHY_PRESET_SIZES.XX_LARGE,
  TYPOGRAPHY_PRESET_SIZES.X_LARGE,
  TYPOGRAPHY_PRESET_SIZES.LARGE,
  TYPOGRAPHY_PRESET_SIZES.MEDIUM,
  TYPOGRAPHY_PRESET_SIZES.SMALL,
  TYPOGRAPHY_PRESET_SIZES.X_SMALL,
  TYPOGRAPHY_PRESET_SIZES.XX_SMALL,
];

export const typography = {
  family: { ...themeFonts },
  weight: {
    bold: 500,
    regular: 400,
    light: 300,
  },
  presets: {
    display: {
      [TYPOGRAPHY_PRESET_SIZES.LARGE]: {
        weight: 700,
        size: 122,
        lineHeight: 124,
        letterSpacing: -2.4,
      },
      [TYPOGRAPHY_PRESET_SIZES.MEDIUM]: {
        weight: 700,
        size: 58,
        lineHeight: 64,
        letterSpacing: -1.4,
      },
      [TYPOGRAPHY_PRESET_SIZES.SMALL]: {
        weight: 700,
        size: 36,
        lineHeight: 40,
        letterSpacing: -1,
      },
    },
    headline: {
      [TYPOGRAPHY_PRESET_SIZES.XX_LARGE]: {
        weight: 500,
        size: 42,
        lineHeight: 56,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.X_LARGE]: {
        weight: 500,
        size: 36,
        lineHeight: 44,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.LARGE]: {
        weight: 500,
        size: 32,
        lineHeight: 40,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.MEDIUM]: {
        weight: 500,
        size: 28,
        lineHeight: 36,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.SMALL]: {
        weight: 500,
        size: 24,
        lineHeight: 32,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.X_SMALL]: {
        weight: 500,
        size: 20,
        lineHeight: 24,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.XX_SMALL]: {
        weight: 500,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
    },
    text: {
      [TYPOGRAPHY_PRESET_SIZES.X_LARGE]: {
        weight: 400,
        size: 24,
        lineHeight: 32,
        letterSpacing: -0.02,
      },
      [TYPOGRAPHY_PRESET_SIZES.LARGE]: {
        weight: 400,
        size: 18,
        lineHeight: 24,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.MEDIUM]: {
        weight: 400,
        size: 16,
        lineHeight: 24,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.SMALL]: {
        weight: 400,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
      [TYPOGRAPHY_PRESET_SIZES.X_SMALL]: {
        weight: 400,
        size: 12,
        lineHeight: 20,
        letterSpacing: 0.16,
      },
    },
  },
};
