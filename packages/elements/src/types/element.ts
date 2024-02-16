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
import type { Solid } from '@googleforcreators/patterns';
import type {
  GifResource,
  Resource,
  SequenceResource,
  VideoResource,
} from '@googleforcreators/media';
import type { ElementBox } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import type { ElementType } from './elementType';
import type { FontMetrics, ProductData } from './data';
import type { Track } from './media';

export enum LinkType {
  Regular = 'regular',
  Branching = 'branching',
}

export interface Link {
  type?: LinkType;
  pageId?: ElementId;
  url: string;
  desc?: string;
  needsProxy?: boolean;
  icon?: string | null;
  rel?: string[];
}

export interface Flip {
  vertical: boolean;
  horizontal: boolean;
}

export interface Mask {
  type: string;
  // TODO(#12259): Remove these from the type & from templates.
  showInLibrary?: boolean;
  name?: string;
  path?: string;
  ratio?: number;
  iconPath?: string;
  iconRatio?: number;
  supportsBorder?: boolean;
}

export interface Border {
  top: number;
  right: number;
  bottom: number;
  left: number;
  locked?: boolean;
  lockedWidth?: boolean;
  color?: Solid;
}

export interface BorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  locked: boolean;
}

export type ElementId = string;

export interface Element extends ElementBox {
  id: ElementId;
  type: ElementType;
  mask?: Mask;
  link?: Link;
  opacity?: number;
  lockAspectRatio?: boolean;
  flip?: Flip;
  groupId?: string;
  border?: Border;
  borderRadius?: BorderRadius;
  layerName?: string;
  isLocked?: boolean;
  isHidden?: boolean;
}

export interface DefaultBackgroundElement extends Element {
  isDefaultBackground: boolean;
  backgroundColor: Solid;
}

export interface BackgroundableElement extends Element {
  isBackground?: boolean;
}

export interface LinkableElement extends Element {
  link: Link;
}

export interface MediaElement extends BackgroundableElement {
  resource: Resource;
  scale?: number;
  focalX?: number;
  focalY?: number;
}

export interface SequenceMediaElement extends MediaElement {
  resource: SequenceResource;
}

export interface VideoElement extends SequenceMediaElement {
  type: ElementType.Video;
  tracks: Track[];
  resource: VideoResource;
}

export interface GifElement extends SequenceMediaElement {
  type: ElementType.Gif;
  resource: GifResource;
}

export interface ProductElement extends Element {
  type: ElementType.Product;
  product: ProductData;
}

export interface StickerElement extends Element {
  type: ElementType.Sticker;
  sticker: {
    type: string;
  };
}

interface BaseTextElementFont {
  service: string;
  family: string;
  fallbacks: string[];
  metrics?: FontMetrics;
}

export interface GoogleTextElementFont extends BaseTextElementFont {
  service: 'fonts.google.com';
}

export interface SystemTextElementFont extends BaseTextElementFont {
  service: 'system';
}

export interface CustomTextElementFont extends BaseTextElementFont {
  service: 'custom';
  url: string;
}

export type TextElementFont =
  | GoogleTextElementFont
  | SystemTextElementFont
  | CustomTextElementFont;

export interface Padding {
  horizontal: number;
  vertical: number;
  locked: boolean;
  hasHiddenPadding?: boolean;
}

export type TextAlign = 'center' | 'justify' | 'left' | 'right';
export interface TextElement extends Element {
  backgroundColor: Solid;
  content: string;
  font: TextElementFont;
  fontSize: number;

  backgroundTextMode?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'p';
  padding?: Padding;
  marginOffset: number;
  lineHeight: number;
  textAlign: TextAlign;
  textColor: Solid;
}
