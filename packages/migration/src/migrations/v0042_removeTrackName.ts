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
import type { Element, Page, Story } from '@googleforcreators/types';

interface PrevElement extends Element {
  tagName?: 'string';
}

interface PrevPage extends Omit<Page, 'elements'> {
  elements: PrevElement[];
}

interface PrevStory extends Omit<Story, 'pages'> {
  pages: PrevPage[];
  backgroundAudio?: string;
}

function removeTrackName(storyData: PrevStory): Story {
  const updatedStoryData = updateStory(storyData);
  const { pages, ...rest } = updatedStoryData;
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}

function updateStory(story: PrevStory): Story {
  if (story?.backgroundAudio) {
    story.backgroundAudio = {
      resource: story?.backgroundAudio,
    };
  }
  return story;
}

function updatePage(page: PrevPage): Page {
  if (page?.backgroundAudio?.tracks?.length > 0) {
    page?.backgroundAudio?.tracks.map((track) => {
      delete track.trackName;
      return track;
    });
  }
  return page;
}

export default removeTrackName;
