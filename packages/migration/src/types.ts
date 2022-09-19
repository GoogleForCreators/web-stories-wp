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
  Pattern,
  Animation,
  ShapeElement,
  Element,
  Attribution,
  ResourceId,
  ResourceSize,
  ResourceType,
  MediaElement,
  VideoResource,
  VideoTrack,
  GifResource,
} from '@googleforcreators/types';

export type FontStyle = 'normal' | 'italic' | 'regular';
export enum FontVariantStyle {
  Normal = 0,
  Italic = 1,
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontVariant = [FontVariantStyle, FontWeight];

export interface FontV0 {
  id: string;
  name: string;
  value: string;
  family: string;
  service?: string;
  weights?: FontWeight[];
  styles?: FontStyle[];
  variants?: FontVariant[];
  fallbacks?: string[];
}

export interface Padding {
  horizontal: number;
  vertical: number;
  locked: boolean;
  hasHiddenPadding: boolean;
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TagName = 'h1' | 'h2' | 'h3' | 'p' | 'auto';
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

export interface ResourceV0 {
  id: ResourceId;
  type: ResourceType;
  mimeType: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  baseColor?: Pattern;
  blurHash?: string;
  isExternal: boolean;
  isPlaceholder: boolean;
  needsProxy: boolean;
  readonly creationDate?: string;
  sizes: { [key: string]: ResourceSize };
  attribution?: Attribution;
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}

interface VideoResourceV0 extends VideoResource {
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}

interface GifResourceV0 extends GifResource {
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}

export interface VideoElementV0 extends MediaElement {
  resource: VideoResourceV0;
  poster?: string;
  tracks?: VideoTrack[];
  loop?: boolean;
}

export interface MediaElementV0 extends Element {
  resource: ResourceV0;
  scale: number;
  focalX?: number;
  focalY?: number;
}

export type ImageElementV0 = MediaElementV0;

export interface GifElementV0 extends MediaElement {
  resource: GifResourceV0;
}

export interface TextElementV0 extends Element {
  content: string;
  font: FontV0;

  backgroundTextMode?: BackgroundTextMode;
  backgroundColor?: Pattern;
  fontSize?: number;
  lineHeight?: number;
  padding?: Padding;
  textAlign?: TextAlign;
  tagName?: TagName;
  marginOffset?: number;
  metrics?: FontMetrics;
}

export interface Group {
  name: string;
  isLocked: boolean;
  isCollapsed?: boolean;
}

// @todo Groups did not exist during V0, should we try to pinpoint when it was added?
export type Groups = Record<string, Group>;

export interface PageV0 {
  elements: Element[];
  defaultBackgroundElement?: ShapeElement;
  animations?: Animation[];
  backgroundColor: Pattern;
  type: 'page';
  groups: Groups;
  backgroundAudio?: {
    src: string;
    id: number;
    mimeType: string;
  };
}

export interface StoryV0 {
  version: number;
  pages: PageV0[];
  backgroundAudio?: {
    src: string;
    id: number;
    mimeType: string;
  };
}
