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

export type FontStyle = 'normal' | 'italic' | 'regular';
export enum FontVariantStyle {
  Normal = 0,
  Italic = 1,
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontVariant = [FontVariantStyle, FontWeight];

export type FontService = 'custom' | 'fonts.google.com' | 'system';

export type FontFamily = string;

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

export interface Font {
  family: FontFamily | 'serif' | 'sans-serif';
  service?: FontService;
  weights?: FontWeight[];
  styles?: FontStyle[];
  variants?: FontVariant[];
  fallbacks?: string[];
  metrics: FontMetrics;
}
