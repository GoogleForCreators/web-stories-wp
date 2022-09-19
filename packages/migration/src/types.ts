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
  AnimationType,
  AnimationPanDirection,
  AnimationZoomDirection,
  ElementBox,
  Attribution,
  ResourceType,
  Mask,
  Border,
  BorderRadius,
  MediaElement,
  VideoTrack,
  TrimData,
} from '@googleforcreators/types';

type TextAlign = 'left' | 'center' | 'right' | 'justify';
type TagName = 'h1' | 'h2' | 'h3' | 'p' | 'auto';

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

interface ResourceSizeV0 {
  mimeType: string;
  sourceUrl: string;
  width: number | string;
  height: number | string;
}

interface ResourceV0 {
  id: string;
  type: ResourceType;
  mimeType: string;
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  blurHash?: string;
  isExternal: boolean;
  isPlaceholder: boolean;
  needsProxy: boolean;
  readonly creationDate?: string;
  sizes: { [key: string]: ResourceSizeV0 };
  attribution?: Attribution;
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}

// @todo this was added later than V0.
interface VideoResourceV0 extends ResourceV0 {
  videoId?: string;
  type: ResourceType.Video;
  length: number;
  lengthFormatted: string;
  isMuted?: boolean;
  trimData?: TrimData;
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}

interface OutputV0 {
  mimeType: string;
  src: string;
  poster?: string;
  sizes?: { [key: string]: ResourceSizeV0 };
}

interface GifResourceV0 extends ResourceV0 {
  type: ResourceType.Gif;
  output: OutputV0;
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}


// @todo GIf didn't exist at that point yet. Check when to add.
export interface GifElementV0 extends MediaElement {
  resource: GifResourceV0;
}

interface LinkV0 {
  url: string;
  desc?: string;
  needsProxy?: boolean;
  icon?: string;
  rel?: string[];
  type?: string;
}

interface ElementV0 extends ElementBox {
  id: string;
  type: string;
  isBackground: boolean;

  mask?: Mask;
  link?: LinkV0;
  lockAspectRatio?: boolean;
  groupId?: string;
  border?: Border;
  borderRadius?: BorderRadius;
}

export interface MediaElementV0 extends ElementV0 {
  isFill?: boolean;
  isFullbleedBackground?: boolean;
  src: string;
  origRatio: number;
  mimeType: string;
  scale: number;
  focalX?: number;
  focalY?: number;
}

export interface VideoElementV0 extends MediaElementV0 {
  poster?: string;
  posterId?: number;
  videoId?: number;
  tracks?: VideoTrack[];
  loop?: boolean;
}

export type ImageElementV0 = MediaElementV0;

export interface TextElementV0 extends ElementV0 {
  content: string;
  bold: boolean;
  fontWeight: number;
  fontStyle: string;
  textDecoration: string;
  letterSpacing: number;
  color: string;
  fontFamily: string;
  fontFallback: string[];

  backgroundColor?: string;
  fontSize?: number;
  lineHeight?: number;
  padding?: number;
  textAlign?: TextAlign;
  tagName?: TagName;
  marginOffset?: number;
  metrics?: FontMetrics;
}

export interface ShapeElementV0 extends ElementV0 {
  backgroundColor: string;
}

export interface Group {
  name: string;
  isLocked: boolean;
  isCollapsed?: boolean;
}

interface AnimationV0 {
  id: string;
  type: AnimationType;
  target: string;
  panDir?: AnimationPanDirection;
  duration: number;
  delay: number;
  zoomDirection?: AnimationZoomDirection;
}

// @todo Groups did not exist during V0, should we try to pinpoint when it was added?
export type Groups = Record<string, Group>;

export interface PageV0 {
  elements: Element[];
  animations?: AnimationV0[];
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
