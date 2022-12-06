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
import type { FunctionComponent } from 'react';
import type {
  Resource,
  ResourceId,
  TrimData,
  VideoResource,
} from '@googleforcreators/media';
import type { ElementId } from '@googleforcreators/elements';

export const INITIAL_STATE = 'INITIAL_STATE';

export enum ContentType {
  Image = 'image',
  Video = 'video',
  Gif = 'gif',
  Sticker = 'sticker',
}

export enum ProviderType {
  Unsplash = 'UNSPLASH',
  Coverr = 'COVERR',
  Tenor = 'TENOR',
  TenorStickers = 'TENOR_STICKERS',
}

export type Provider = {
  provider: ProviderType;
  displayName: string;
  contentTypeFilter?: ContentType;
  supportsCategories: boolean;
  requiresAuthorAttribution: boolean;
  attributionComponent: FunctionComponent;
  fetchMediaErrorMessage: string;
  fetchCategoriesErrorMessage?: string;
  defaultPreviewWidth?: number;
};

export type Providers = Record<string, Provider>;

export enum Media3pContentType {
  Image = 'IMAGE',
  Video = 'VIDEO',
  Gif = 'GIF',
  Sticker = 'STICKER',
}

type AbstractMedia3pMedia = {
  name: string;
  provider: ProviderType;
  type: Media3pContentType;
  author: { displayName: string; url: string };
  title?: string;
  description?: string;
  createTime: string;
  updateTime?: string;
  registerUsageUrl: string;
  color?: string;
  blurHash?: string;
};

export type Media3pStillMedia = AbstractMedia3pMedia & {
  type: Media3pContentType.Image;
  imageUrls: ImageUrl[];
};

export type Media3pSequenceMedia = AbstractMedia3pMedia & {
  imageUrls: ImageUrl[];
  videoUrls: VideoUrl[];
  videoMetadata: {
    duration: string;
  };
};

export type Media3pMedia = Media3pStillMedia | Media3pSequenceMedia;

export type ImageUrl = {
  imageName?: string;
  url: string;
  sourceUrl: string;
  file: string;
  mimeType: string;
  width: number;
  height: number;
};

export type VideoUrl = {
  url: string;
  mimeType: string;
  width: number;
  height: number;
  duration: number;
};

export type ImageSize = {
  file: string;
  sourceUrl: string;
  mimeType: string;
  width: number;
  height: number;
};

export type MediaUrls = ImageUrl[] | VideoUrl[];

export interface ImageSizes {
  [keyof: string]: ImageSize;
  web_stories_thumbnail: ImageSize;
  large: ImageSize;
  full: ImageSize;
}

export type CropParams = {
  newWidth: number;
  newHeight: number;
  cropElement: {
    x: number;
    y: number;
  };
  cropWidth: number;
  cropHeight: number;
  cropX: number;
  cropY: number;
};

export interface UpdateMediaProps {
  mediaSource?: string;
  optimizedId?: ResourceId;
  mutedId?: ResourceId;
}

interface UploadMediaAdditionalData {
  originalId?: ResourceId;
  isMuted?: boolean;
  isGif?: boolean;
  trimData?: TrimData;
  mediaSource?: string;
  cropOriginId?: ResourceId;
  cropParams?: CropParams;
}

export interface UploadMediaArgs {
  onUploadStart?: (args: { resource: Resource }) => unknown;
  onUploadSuccess?: (args: { id: number; resource: Resource }) => unknown;
  onUploadProgress?: (args: { resource: Resource }) => unknown;
  onUploadError?: () => unknown;
  cropVideo?: boolean;
  muteVideo?: boolean;
  additionalData?: UploadMediaAdditionalData;
  originalResourceId?: ResourceId;
  resource?: Partial<Resource> | Partial<VideoResource>;
  storyId?: number | null;
  altText?: string;
  mediaSource?: string;
  posterFile?: File | Blob | null;
  elementId?: ElementId;
  trimData?: TrimData;
}
