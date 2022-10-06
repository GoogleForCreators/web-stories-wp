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
import type { ElementBox } from './elementBox';
import type { Solid } from './pattern';

export interface Link {
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
  type: string;
  mask?: Mask;
  link?: Link;
  opacity?: number;
  lockAspectRatio?: boolean;
  flip?: Flip;
  groupId?: string;
  border?: Border;
  borderRadius?: BorderRadius;

  // TODO(#12262): Remove this.
  basedOn?: ElementId;
}

export enum ElementType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Gif = 'gif',
  Sticker = 'sticker',
  Shape = 'shape',
  Product = 'product',
}
