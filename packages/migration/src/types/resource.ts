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

export enum ResourceType {
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

export interface ResourceV0 {
  type: ResourceType;
  mimeType: string;
  src: string;
  width: number | string;
  height: number | string;
}

export interface ImageResourceV0 extends ResourceV0 {
  type: ResourceType.Image;
}

export interface VideoResourceV0 extends ResourceV0 {
  poster?: string;
  posterId?: number;
  videoId?: number;
  type: ResourceType.Video;
}

interface OutputV0 {
  mimeType: string;
  src: string;
  poster?: string;
  sizes?: { [key: string]: ResourceSizeV0 };
}

export interface GifResourceV0 extends ResourceV0 {
  type: ResourceType.Gif;
  output: OutputV0;
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
  alt: string;
}
