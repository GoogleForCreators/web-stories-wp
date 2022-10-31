/*
 * Copyright 2021 Google LLC
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
import type { ResourceType } from './resourceType';
import type { ResourceSize, Attribution, ResourceId } from './resource';
import type { TrimData } from './videoResource';
import type { Output } from './gifResource';

export interface ResourceInput {
  /**
   * The resource ID.
   * TODO: currently this value is local to the editor's media system.
   */
  id: ResourceId;
  /** The type of the resource. */
  type: ResourceType;
  /** The MIME type of the resource. E.g. "image/png". */
  mimeType: string;
  /** The source URL of the resource. */
  src: string;
  /** The "alt" text of the resource. */
  alt: string;
  /** The natural width of the resource in physical pixels. */
  width: number;
  /** The natural height of the resource in physical pixels. */
  height: number;
  /** The resource's average color. */
  baseColor?: string;
  /** BlurHash. */
  blurHash?: string;
  /** Whether the resource externally hosted. */
  isExternal?: boolean;
  /** Whether the resource is a placeholder. */
  isPlaceholder?: boolean;
  /** Whether the resource needs a CORS proxy. */
  needsProxy: boolean;
  /** Resource creation date. */
  creationDate?: string;
  /** Resource sizes */
  sizes: { [key: string]: ResourceSize };
  /** Resource author a ttribution */
  attribution?: Attribution;
  /** The resource's poster. */
  poster?: string;
  /** The resource's poster ID. */
  posterId?: string;
  /** Length in seconds. */
  length?: number;
  /** The formatted length, e.g. "01:17". */
  lengthFormatted?: string;
  /** Whether the resource has already been optimized. */
  isOptimized?: boolean;
  /** Whether the resource is muted. */
  isMuted?: boolean;
  /** Information about trimmed video and its original. */
  trimData?: TrimData;
  /** Output type data, for GIFs */
  output?: Output;
}
