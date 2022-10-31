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

export interface Dimensions {
  width: number;
  height: number;
}

export interface AttributionAuthor {
  /** Display name of the author. */
  displayName: string;
  /** The author's profile or website. */
  url: string;
}

export interface Attribution {
  /** The optional author of the media object. */
  author?: AttributionAuthor;
  /** The optional url to register the media usage. */
  registerUsageUrl?: string;
}

export interface ResourceSize {
  /** The MIME type of the resource. E.g. "image/png". */
  mimeType: string;
  /** The source URL of the resource. */
  sourceUrl: string;
  /** The natural width of the resource in physical pixels. */
  width: number;
  /** The natural height of the resource in physical pixels. */
  height: number;
}

export type ResourceId = string | number;

/** A media resource. */
export interface Resource {
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
  isExternal: boolean;
  /** Whether the resource is a placeholder. */
  isPlaceholder?: boolean;
  /** Whether the resource needs a CORS proxy. */
  needsProxy?: boolean;
  /** Resource creation date. */
  readonly creationDate?: string;
  /** Resource sizes */
  sizes: { [key: string]: ResourceSize } | never[];
  /** Resource author attribution */
  attribution?: Attribution;

  // TODO: Figure out why sometimes _images_ end up having these properties.
  posterId?: ResourceId;
  isOptimized?: boolean;

  // TODO: This property should probably not end up in a story. Only relevant for the media library.
  provider?: 'local' | 'unsplash' | 'coverr' | 'tenor' | 'tenor_stickers';
}
