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
  GifResourceV38,
  ImageResourceV38,
  VideoResourceV38,
  GifElementV38,
  ImageElementV38,
  PageV38,
  ProductElementV38,
  ShapeElementV38,
  StoryV38,
  TextElementV38,
  VideoElementV38,
} from './v0038_camelCaseResourceSizes';

export type TextElementV39 = TextElementV38;
export type ProductElementV39 = ProductElementV38;
export type ShapeElementV39 = ShapeElementV38;
export type ImageElementV39 = ImageElementV38;
export type VideoElementV39 = VideoElementV38;
export type GifElementV39 = GifElementV38;

export type ImageResourceV39 = ImageResourceV38;
export type VideoResourceV39 = VideoResourceV38;
export type GifResourceV39 = GifResourceV38;

export type UnionElementV39 =
  | ShapeElementV39
  | ImageElementV39
  | VideoElementV39
  | GifElementV39
  | TextElementV39
  | ProductElementV39;

export interface AudioTrackV39 {
  track: string;
  trackId: number;
  trackName: string;
  id: string;
  srcLang?: string;
  label?: string;
  kind: string;
}

interface BackgroundAudioResource {
  src: string;
  id: number;
  mimetype: string;
}
export interface BackgroundAudioV39 {
  resource: BackgroundAudioResource;
  tracks?: AudioTrackV39[];
  loop?: boolean;
}
export interface StoryV39 extends Omit<StoryV38, 'pages' | 'backgroundAudio'> {
  pages: PageV39[];
  backgroundAudio?: BackgroundAudioV39;
}
export interface PageV39 extends Omit<PageV38, 'elements' | 'backgroundAudio'> {
  elements: UnionElementV39[];
  backgroundAudio?: BackgroundAudioV39;
}

function backgroundAudioFormatting(storyData: StoryV38): StoryV39 {
  const updatedStoryData = updateStory(storyData);
  const { pages, ...rest } = updatedStoryData;
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}
function updateStory(story: StoryV38): StoryV39 {
  if ('backgroundAudio' in story) {
    return {
      ...story,
      backgroundAudio: {
        resource: story.backgroundAudio as BackgroundAudioResource,
      },
    };
  }
  return story;
}
function updatePage(page: PageV38): PageV39 {
  if ('backgroundAudio' in page && page.backgroundAudio) {
    return {
      ...page,
      backgroundAudio: {
        resource: page.backgroundAudio as BackgroundAudioResource,
        loop: true,
        tracks: [],
      },
    };
  }
  return page;
}

export default backgroundAudioFormatting;
