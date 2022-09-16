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
  ElementV39,
  PageV39,
  StoryV39,
} from './v0040_andadaFontToAndadaPro';

export type ElementV38 = ElementV39;

export interface PageV38 extends Omit<PageV39, 'elements' | 'backgroundAudio'> {
  elements: ElementV38[];
  backgroundAudio?: Record<string, unknown>;
}

export interface StoryV38 extends Omit<StoryV39, 'pages'> {
  pages: PageV38[];
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
  if (story?.backgroundAudio) {
    story.backgroundAudio = {
      resource: story?.backgroundAudio,
    };
  }
  return story as StoryV39;
}
function updatePage(page: PageV38): PageV39 {
  if (page?.backgroundAudio) {
    page.backgroundAudio = {
      resource: page?.backgroundAudio,
      loop: true,
      tracks: [],
    };
  }
  return page as PageV39;
}

export default backgroundAudioFormatting;
