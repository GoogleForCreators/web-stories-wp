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

export interface ElementLink {
  url: string;
  desc?: string;
  needsProxy?: boolean;
  icon?: string;
  rel?: string[];
}

export interface ElementFlip {
  vertical: number;
  horizontal: number;
}

export interface ElementMask {
  type: string;
}

export interface ElementBorder {
  top: number;
  right: number;
  bottom: number;
  left: number;
  locked: boolean;
}

export interface ElementBorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  locked: boolean;
}

export interface Element extends ElementBox {
  id: string;
  type: string;
  isBackground: boolean;

  mask?: ElementMask;
  link?: ElementLink;
  opacity?: number;
  lockAspectRatio?: boolean;
  flip?: ElementFlip;
  groupId?: string;
  border?: ElementBorder;
  borderRadius?: ElementBorderRadius;
}
