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
import type { Solid, Pattern } from '@googleforcreators/patterns';
import type {
  Resource,
  SequenceResource,
  GifResource,
  VideoResource,
} from '@googleforcreators/media';
import type { ElementBox } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import type { ElementType } from './elementType';
import type { Track } from './media';
import type {
  ProductData,
  GoogleFontData,
  SystemFontData,
  CustomFontData,
} from './data';

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

export interface LinkableElement extends Element {
  link: Link;
}

export interface DefaultBackgroundElement extends Element {
  isDefaultBackground: boolean;
  backgroundColor: Solid;
}

export interface BackgroundableElement extends Element {
  isBackground?: boolean;
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
  poster?: string;
  loop?: boolean;
}

export interface GifElement extends SequenceMediaElement {
  type: ElementType.Gif;
  resource: GifResource;
}

export interface ImageElement extends MediaElement {
  type: ElementType.Image;
}

export interface OverlayableElement extends Element {
  overlay?: Pattern | null;
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

export type TextElementFont = GoogleFontData | SystemFontData | CustomFontData;

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
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'auto';
  padding?: Padding;
  marginOffset: number;
  lineHeight: number;
  textAlign: TextAlign;
}

export interface AudioStickerElement extends Element {
  type: ElementType.AudioSticker;
  sticker: string;
  size: string;
  style: string;
}

export interface ShapeElement extends Element {
  type: ElementType.Shape;
}
