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
 * External dependencies
 */
import { createSolid } from '@googleforcreators/patterns';

export const ELEMENT_TYPES = {
  IMAGE: 'image',
  SHAPE: 'shape',
  TEXT: 'text',
  VIDEO: 'video',
  GIF: 'gif',
  STICKER: 'sticker',
  PRODUCT: 'product',
} as const;

export const MEDIA_ELEMENT_TYPES = [
  ELEMENT_TYPES.IMAGE,
  ELEMENT_TYPES.VIDEO,
  ELEMENT_TYPES.GIF,
  ELEMENT_TYPES.PRODUCT,
] as const;

export const MULTIPLE_VALUE = '((MULTIPLE))';

// @todo: only provide font family, and use font provider to fill the rest.
export const TEXT_ELEMENT_DEFAULT_FONT = {
  family: 'Roboto',
  weights: [100, 300, 400, 500, 700, 900],
  styles: ['italic', 'regular'],
  variants: [
    [0, 100],
    [1, 100],
    [0, 300],
    [1, 300],
    [0, 400],
    [1, 400],
    [0, 500],
    [1, 500],
    [0, 700],
    [1, 700],
    [0, 900],
    [1, 900],
  ],
  fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
  service: 'fonts.google.com',
  metrics: {
    upm: 2048,
    asc: 1900,
    des: -500,
    tAsc: 1536,
    tDes: -512,
    tLGap: 102,
    wAsc: 1946,
    wDes: 512,
    xH: 1082,
    capH: 1456,
    yMin: -555,
    yMax: 2163,
    hAsc: 1900,
    hDes: -500,
    lGap: 0,
  },
};

export const BACKGROUND_TEXT_MODE = {
  NONE: 'NONE',
  FILL: 'FILL',
  HIGHLIGHT: 'HIGHLIGHT',
};

export const OverlayType = {
  NONE: 'none',
  SOLID: 'solid',
  LINEAR: 'linear',
  RADIAL: 'radial',
};

export const DEFAULT_PAGE_BACKGROUND_COLOR = createSolid(255, 255, 255);
