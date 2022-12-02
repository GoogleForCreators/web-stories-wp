/*
 * Copyright 2022 Google LLC
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
import type { Pattern } from '@googleforcreators/patterns';
import type { AudioResource } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import type { Page } from './page';

export type FontStyle = 'normal' | 'italic' | 'regular';
export enum FontVariantStyle {
  Normal = 0,
  Italic = 1,
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontVariant = [FontVariantStyle, FontWeight];

export interface FontMetrics {
  upm: number;
  asc: number;
  des: number;
  tAsc: number;
  tDes: number;
  tLGap: number;
  wAsc: number;
  wDes: number;
  xH: number;
  capH: number;
  yMin: number;
  yMax: number;
  hAsc: number;
  hDes: number;
  lGap: number;
}

export interface FontData {
  family: string;
  service?: string;
  weights?: FontWeight[];
  styles?: FontStyle[];
  variants?: FontVariant[];
  fallbacks?: string[];
  metrics?: FontMetrics;
}

export interface ProductImage {
  alt: string;
  url: string;
}

export interface ProductData {
  productId: string;
  productBrand: string;
  productDetails: string;
  productImages: ProductImage[];
  productPrice: number;
  productPriceCurrency: string;
  productTitle: string;
  productUrl: string;
}

// Data retrieved as part of the raw data from the backend, used for example in the templates, in migration.
export interface StoryData {
  version: number;
  pages: Page[];
  autoAdvance: boolean;
  defaultPageDuration: number;
  currentStoryStyles: {
    colors: Pattern[];
  };
  backgroundAudio?: {
    resource: AudioResource;
  };
  fonts?: Record<string, FontData>;
}
