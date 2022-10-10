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
import type { Page, Story, Element } from '@googleforcreators/types';

export interface TextSetData extends Omit<Story, 'pages'> {
  current: null;
  selection: never[];
  story: Record<string, never>;
  version: number;
  pages: TextSetPage[];
}

export interface TextSetPage extends Page {
  fonts: string[];
  id: string;
}

export interface MinMax {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface TextSetElement extends Element {
  normalizedOffsetX: number;
  normalizedOffsetY: number;
  textSetWidth: number;
  textSetHeight: number;
}

export interface TextSet {
  id: string;
  elements: TextSetElement[];
  textSetCategory: string;
  textSetFonts: string[];
}

export interface TextSets {
  cover: TextSet[];
  step: TextSet[];
  section_header: TextSet[];
  editorial: TextSet[];
  contact: TextSet[];
  table: TextSet[];
  list: TextSet[];
  quote: TextSet[];
}
