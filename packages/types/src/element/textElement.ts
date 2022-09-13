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

/**
 * Internal dependencies
 */
import type { Element } from './element';

export type ElementFontVariant = [number, number];

export type ElementFontStyle = 'normal' | 'italic';

export interface ElementFont {
  family: string;
  service?: string;
  weights?: number[];
  styles?: ElementFontStyle[];
  variants?: ElementFontVariant[];
  fallbacks?: string[];
}

export interface ElementPadding {
  horizontal: number;
  vertical: number;
  locked: boolean;
  hasHiddenPadding: boolean;
}

export type ElementTextAlign = 'left' | 'center' | 'right' | 'justify';
export type ElementTagName = 'h1' | 'h2' | 'h3' | 'p' | 'auto';
export type ElementBackgroundTextMode = 'NONE' | 'FILL' | 'HIGHLIGHT';

export interface TextElement extends Element {
  content: string;
  font: ElementFont;

  backgroundTextMode?: ElementBackgroundTextMode;
  backgroundColor?: Pattern;
  fontSize?: number;
  lineHeight?: number;
  padding?: ElementPadding;
  textAlign?: ElementTextAlign;
  tagName?: ElementTagName;
  marginOffset?: number;
}
