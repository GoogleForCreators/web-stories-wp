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
import type {
  GifResourceV41,
  ImageResourceV41,
  VideoResourceV41,
  GifElementV41,
  ImageElementV41,
  PageV41,
  ProductElementV41,
  ShapeElementV41,
  StoryV41,
  TextElementV41,
  VideoElementV41,
} from './v0041_removeFontProperties';

// @todo Should we now add Track version to each file instead?
import type { AudioTrackV39 } from './v0039_backgroundAudioFormatting';

export type TextElementV42 = TextElementV41;
export type ProductElementV42 = ProductElementV41;
export type ShapeElementV42 = ShapeElementV41;
export type ImageElementV42 = ImageElementV41;
export type VideoElementV42 = VideoElementV41;
export type GifElementV42 = GifElementV41;

export type ImageResourceV42 = ImageResourceV41;
export type VideoResourceV42 = VideoResourceV41;
export type GifResourceV42 = GifResourceV41;

export type UnionElementV42 =
  | ShapeElementV42
  | ImageElementV42
  | VideoElementV42
  | GifElementV42
  | TextElementV42
  | ProductElementV42;

export interface StoryV42 extends Omit<StoryV41, 'pages'> {
  pages: PageV42[];
}

interface Track {
  track: string;
  trackId: number;
  id: string;
  srcLang?: string;
  label?: string;
  kind: string;
}

export interface PageV42 extends Omit<PageV41, 'elements' | 'backgroundAudio'> {
  elements: UnionElementV42[];
  backgroundAudio?: {
    loop?: boolean;
    resource: {
      src: string;
      id: number;
      mimetype: string;
    };
    tracks: Track[];
  };
}

function removeTrackName(storyData: StoryV41): StoryV42 {
  const { pages, ...rest } = storyData;
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}

function updatePage(page: PageV41): PageV42 {
  if (
    'backgroundAudio' in page &&
    page.backgroundAudio &&
    'tracks' in page.backgroundAudio &&
    page.backgroundAudio.tracks
  ) {
    const tracks = page.backgroundAudio.tracks.map((track: AudioTrackV39) => {
      const { trackName, ...rest } = track;
      return rest;
    });
    return {
      ...page,
      backgroundAudio: {
        ...page.backgroundAudio,
        tracks,
      },
    };
  }
  return page;
}

export default removeTrackName;
