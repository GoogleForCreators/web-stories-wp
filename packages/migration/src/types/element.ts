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
import type { GifResourceV0 } from './resource';

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

export interface LinkV0 {
  url: string;
  desc?: string;
  needsProxy?: boolean;
  icon?: string;
  rel?: string[];
  type?: string;
}

interface ElementBoxV0 {
  x: number;
  y: number;
  width: number;
  height: number;
  rotationAngle: number;
}

interface BorderV0 {
  top: number;
  right: number;
  bottom: number;
  left: number;
  locked: boolean;
}

interface BorderRadiusV0 {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  locked: boolean;
}

export interface ElementV0 extends ElementBoxV0 {
  id: string;
  type: string;
  isBackground: boolean;

  mask?: {
    type: string;
  };
  link?: LinkV0;
  lockAspectRatio?: boolean;
  groupId?: string;
  border?: BorderV0;
  borderRadius?: BorderRadiusV0;
}

export interface MediaElementV0 extends ElementV0 {
  isFullbleed?: boolean;
  isFullbleedBackground?: boolean;
  src: string;
  origRatio: number;
  mimeType: string;
  scale: number;
  focalX?: number;
  focalY?: number;
}

export interface GifElementV0 extends MediaElementV0 {
  opacity: number;
  resource: GifResourceV0;
}

interface VideoTrackV0 {
  id: string;
  track: string;
  trackId?: number;
  kind?: string;
  srclang?: string;
  label?: string;
  needsProxy?: boolean;
}

export interface VideoElementV0 extends MediaElementV0 {
  poster: string;
  posterId: number;
  videoId: number;
  tracks?: VideoTrackV0[];
  loop?: boolean;
  type: 'video';
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

export interface ProductElementV0 extends ElementV0 {
  productId: string;
}

export type UnionElementV0 =
  | ShapeElementV0
  | ImageElementV0
  | VideoElementV0
  | TextElementV0;
