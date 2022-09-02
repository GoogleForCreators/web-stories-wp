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
 * External dependencies
 */
/* eslint-disable no-restricted-imports -- Still used by other packages. */
import * as PropTypes from 'prop-types';
import type { Requireable } from 'prop-types';
/* eslint-enable no-restricted-imports -- Still used by other packages. */

const ResourcePropTypes: Record<string, Requireable<unknown>> = {};

ResourcePropTypes.resourceSize = PropTypes.shape({
  file: PropTypes.string,
  sourceUrl: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});

ResourcePropTypes.imageResourceSizes = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.objectOf(ResourcePropTypes.resourceSize),
]);

ResourcePropTypes.videoResourceSizes = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.objectOf(ResourcePropTypes.resourceSize),
]);

ResourcePropTypes.imageResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  sizes: ResourcePropTypes.imageResourceSizes,
});

ResourcePropTypes.trackResource = PropTypes.shape({
  id: PropTypes.string.isRequired,
  track: PropTypes.string.isRequired,
  trackId: PropTypes.number,
  kind: PropTypes.string,
  srclang: PropTypes.string,
  label: PropTypes.string,
  needsProxy: PropTypes.bool,
});

ResourcePropTypes.videoResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  poster: PropTypes.string,
  posterId: PropTypes.number,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  alt: PropTypes.string,
  title: PropTypes.string,
  sizes: ResourcePropTypes.videoResourceSizes,
});

ResourcePropTypes.gifResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  title: PropTypes.string,
  alt: PropTypes.string,
  sizes: ResourcePropTypes.imageResourceSizes,
  output: PropTypes.shape({
    mimeType: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    sizes: PropTypes.shape({
      mp4: ResourcePropTypes.videoResourceSizes,
      webm: ResourcePropTypes.videoResourceSizes,
    }),
  }),
});

ResourcePropTypes.resource = PropTypes.oneOfType([
  ResourcePropTypes.imageResource,
  ResourcePropTypes.videoResource,
  ResourcePropTypes.trackResource,
  ResourcePropTypes.gifResource,
]);

export { ResourcePropTypes };

/**
 * Author object
 *
 * @typedef {Author} Author
 * @property {string} displayName The display name of the author.
 * @property {?string} url An optional URL to link to the author's profile or
 * website.
 */

/**
 * Attribution object
 *
 * @typedef {Attribution} Attribution
 * @property {?Author} author The optional author of the media object.
 * @property {?string} registerUsageUrl The optional url to register the media
 * usage.
 */

/**
 * TrimData object
 *
 * @typedef {TrimData} TrimData data object linking a trimmed video to its original
 * @property {number} original The ID of the original video.
 * @property {string} start Time stamp of start time of new video. Example '00:01:02.345'.
 * @property {string} end Time stamp of end time of new video. Example '00:02:00'.
 */

/**
 * Attachment object.
 *
 * @typedef {Attachment} Attachment
 * @property {string|null} baseColor Attachment base color.
 * @property {string|null} blurHash Attachment blur hash.
 * @property {string} [type] Attachment type, e.g. video or image.
 * @property {string} mimeType The MIME type.
 * @property {string|null} creationDate When the attachment was created.
 * @property {string} src The source URL.
 * @property {number} width The natural resource width.
 * @property {number} height The natural resource height.
 * @property {string|null} poster The poster URL for the "video" type.
 * @property {number|null} posterId The system poster ID.
 * @property {number|null} id The system ID.
 * @property {number|null} length The length for the "video" type.
 * @property {string|null} lengthFormatted The formatted length for the "video" type.
 * @property {string|null} alt The user-readable accessibility label for the resource.
 * @property {boolean} local Whether the resource has been already uploaded to the server.
 * @property {boolean} isOptimized Whether the resource has already been optimized.
 * @property {boolean|null} isMuted Whether the resource has already been muted.
 * @property {boolean|null} isExternal Whether the resource is externally hosted.
 * @property {boolean|null} isPlaceholder Whether the resource is a placeholder.
 * @property {Object} sizes Object of image sizes.
 * @property {?Object} output An optional object of video sizes for rendering gifs as videos.
 * @property {?TrimData} trimData An optional object of video trim data.
 * @property {boolean} needsProxy Whether the resource needs a CORS proxy.
 */

/**
 * ResourceSize object
 *
 * @typedef {ResourceSize} ResourceSize
 * @property {number} width The width of the ResourceSize.
 * @property {number} height The height of the ResourceSize.
 * @property {string} sourceUrl The URL pointing to the resource for this size.
 * @property {string|null} mimeType The mimeType of this ResourceSize.
 */

/**
 * Resource object.
 *
 * @typedef {Resource} Resource
 * @property {string|null} baseColor An optional attribution to detect the base color of a resource (an image or video). Value looks like #ff00ff.
 * @property {string|null} blurHash An optional attribution to detect the blurhash of a resource (an image or video).
 * @property {string|null} type Resource type. Currently only "image" and "video" values are allowed. If not specified, will be calculated from the mime-type.
 * @property {string} mimeType The MIME type.
 * @property {string|null} creationDate When resource was created.
 * @property {string} src The source URL.
 * @property {number} width The natural resource width.
 * @property {number} height The natural resource height.
 * @property {string|null} poster The poster URL for the "video" type.
 * @property {number|null} posterId The system poster ID.
 * @property {number|null} id The system ID.
 * @property {number|null} length The length for the "video" type.
 * @property {string|null} lengthFormatted The formatted length for the "video" type.
 * @property {string|null} alt The user-readable accessibility label for the resource.
 * @property {boolean} local Whether the resource has been already uploaded to the server.
 * @property {boolean} isOptimized Whether the resource has already been optimized.
 * @property {boolean} isMuted Whether the resource has already been muted.
 * @property {boolean} isExternal Whether the resource is externally hosted.
 * @property {boolean} isPlaceholder Whether the resource is a placeholder.
 * @property {Object.<string, ResourceSize>} sizes Object of image sizes.
 * @property {Attribution|null} attribution An optional attribution for the resource.
 * @property {?Object} output An optional object of video sizes for rendering gifs as videos
 * @property {?TrimData} trimData An optional object of video trim data.
 * @property {boolean} needsProxy Whether the resource needs a CORS proxy.
 */

export interface Dimensions {
  width: number;
  height: number;
}

export enum ResourceType {
  IMAGE = 'image',
  VIDEO = 'video',
  GIF = 'gif',
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

export interface TrimData {
  /** ID of the original video. */
  original: string;
  /** Time stamp of start time of new video. Example '00:01:02.345'. */
  start: string;
  /** Time stamp of end time of new video. Example '00:01:02.345'. */
  end: string;
}

export interface Output {
  /** The MIME type of the resource. E.g. "image/png". */
  mimeType: string;
  /** The source URL of the resource. */
  src: string;
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

export type ResourceId = string;

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
  isPlaceholder: boolean;
  /** Whether the resource needs a CORS proxy. */
  needsProxy: boolean;
  /** Resource creation date. */
  readonly creationDate?: string;
  /** Resource sizes */
  sizes: { [key: string]: ResourceSize };
  /** Resource author attribution */
  attribution?: Attribution;
}

export interface VideoResource extends Resource {
  /** The resource's poster. */
  poster?: string;
  /** The resource's poster ID. */
  posterId?: string;
  /** Length in seconds. */
  length: number;
  /** The formatted length, e.g. "01:17". */
  lengthFormatted: string;
  /** Whether the resource has already been optimized. */
  isOptimized?: boolean;
  /** Whether the resource is muted. */
  isMuted?: boolean;
  /** Information about trimmed video and its original. */
  trimData?: TrimData;
}

export interface GifResource extends Resource {
  output: Output;
}

export interface ResourceInput {
  /**
   * The resource ID.
   * TODO: currently this value is local to the editor's media system.
   */
  id: string;
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
