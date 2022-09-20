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

enum ResourceTypeV0 {
  Image = 'image',
  Video = 'video',
  Gif = 'gif',
}

interface ResourceSizeV0 {
  mimeType: string;
  sourceUrl: string;
  width: number | string;
  height: number | string;
}

interface AttributionAuthorV0 {
  displayName: string;
  url: string;
}

interface AttributionV0 {
  author?: AttributionAuthorV0;
  registerUsageUrl?: string;
}

interface ResourceV0 {
  id: string;
  type: ResourceTypeV0;
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
  attribution?: AttributionV0;
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}

interface TrimDataV0 {
  original: string;
  start: string;
  end: string;
}

export interface VideoResourceV0 extends ResourceV0 {
  videoId?: string;
  type: ResourceTypeV0.Video;
  length: number;
  lengthFormatted: string;
  isMuted?: boolean;
  trimData?: TrimDataV0;
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

export interface GifResourceV0 extends ResourceV0 {
  type: ResourceTypeV0.Gif;
  output: OutputV0;
  local?: boolean;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
}
