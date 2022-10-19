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
import type {
  Story,
  GifElement,
  ImageElement,
  Page,
  ProductElement,
  ShapeElement,
  TextElement,
  VideoElement,
  StickerElement,
} from '@googleforcreators/types';

export interface Color {
  label: string;
  color: string;
  family: string;
}

export interface MetaData {
  slug: string;
  creationDate: string;
  title: string;
  tags: string[];
  colors: Color[];
  description: string;
  vertical: string;
  createdBy?: string;
  modified?: string;
}

type UnionElement =
  | TextElement
  | GifElement
  | ProductElement
  | VideoElement
  | ImageElement
  | ShapeElement
  | StickerElement;

export interface TemplateData extends Omit<Story, 'pages'> {
  current: null;
  selection: never[];
  story: Record<string, never>;
  version: number;
  pages: TemplatePage[];
}

interface TemplatePage
  extends Omit<Page, 'autoAdvance' | 'defaultPageDuration' | 'elements'> {
  pageTemplateType: string | null;
  elements: UnionElement[];
}

export type RawTemplate = MetaData & TemplateData;

type Poster = {
  webp: string;
  png: string;
  type: string;
};

export interface Template extends RawTemplate {
  postersByPage: Poster[];
}
