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
 * Internal dependencies
 */
import type { Element } from './element';
import type { Pattern } from './pattern';

export type FontStyle = 'normal' | 'italic' | 'regular';
export enum FontVariantStyle {
  Normal = 0,
  Italic = 1,
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontVariant = [FontVariantStyle, FontWeight];

export interface Font {
  family: string;
  service?: string;
  weights?: FontWeight[];
  styles?: FontStyle[];
  variants: FontVariant[];
  fallbacks?: string[];
  url?: string;
}

export interface Padding {
  horizontal: number;
  vertical: number;
  locked: boolean;
  hasHiddenPadding: boolean;
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type BackgroundTextMode = 'NONE' | 'FILL' | 'HIGHLIGHT';

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

export interface TextElement extends Element {
  content: string;
  font: Font;

  backgroundTextMode?: BackgroundTextMode;
  backgroundColor?: Pattern;
  fontSize?: number;
  lineHeight?: number;
  padding?: Padding;
  textAlign?: TextAlign;
  marginOffset?: number;
  metrics?: FontMetrics;
}
