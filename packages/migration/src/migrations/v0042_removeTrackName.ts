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
import type { ElementV43, PageV43, StoryV43 } from './v0043_removeTagNames';

interface ElementV42 extends ElementV43 {
  tagName?: 'string';
}

interface Track {
  track: string;
  trackId: number;
  id: string;
  srcLang: string;
  label: string;
  kind: string;
  trackName?: string;
}

interface PageV42 extends Omit<PageV43, 'elements'> {
  elements: ElementV42[];
  backgroundAudio?: {
    tracks: Track[];
  };
}

interface StoryV42 extends Omit<StoryV43, 'pages'> {
  pages: PageV42[];
  backgroundAudio?: Record<string, unknown>;
}

function removeTrackName(storyData: StoryV42): StoryV43 {
  const updatedStoryData = updateStory(storyData);
  const { pages, ...rest } = updatedStoryData;
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}

function updateStory(story: StoryV42): StoryV43 {
  if (story?.backgroundAudio) {
    story.backgroundAudio = {
      resource: story?.backgroundAudio,
    };
  }
  return story;
}

function updatePage(page: PageV42): PageV43 {
  if (
    page?.backgroundAudio?.tracks &&
    page?.backgroundAudio?.tracks?.length > 0
  ) {
    page?.backgroundAudio?.tracks.map((track) => {
      delete track.trackName;
      return track;
    });
  }
  return page;
}

export default removeTrackName;
