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
import type { StoryV42, PageV42, ElementV42 } from './v0043_removeTagNames';

interface TrackV41 {
  track: string;
  trackId: number;
  id: string;
  srcLang: string;
  label: string;
  kind: string;
  trackName?: string;
}

export interface PageV41 extends Omit<PageV42, 'elements'> {
  elements: ElementV42[];
  backgroundAudio?: {
    resource?: Record<string, unknown>;
    tracks: TrackV41[];
  };
}

export interface StoryV41 extends Omit<StoryV42, 'pages'> {
  pages: PageV41[];
  backgroundAudio?: Record<string, unknown>;
}

function removeTrackName(storyData: StoryV41): StoryV42 {
  const updatedStoryData = updateStory(storyData);
  const { pages, ...rest } = updatedStoryData;
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}

function updateStory(story: StoryV41): StoryV42 {
  if (story?.backgroundAudio) {
    story.backgroundAudio = {
      resource: story?.backgroundAudio,
    };
  }
  return story as StoryV42;
}

function updatePage(page: PageV41): PageV42 {
  if (
    page?.backgroundAudio?.tracks &&
    page?.backgroundAudio?.tracks?.length > 0
  ) {
    page?.backgroundAudio?.tracks.map((track) => {
      delete track.trackName;
      return track;
    });
  }
  return page as PageV42;
}

export default removeTrackName;
