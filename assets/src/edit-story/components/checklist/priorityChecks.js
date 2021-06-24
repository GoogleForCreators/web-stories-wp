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
import PublisherLogoSize from './checks/publisherLogoSize';
import StoryMissingExcerpt from './checks/storyMissingExerpt';
import StoryMissingTitle from './checks/storyMissingTitle';
import StoryPosterAspectRatio from './checks/storyPosterAspectRatio';
import { StoryPosterAttached } from './checks/storyPosterAttached';
import StoryPosterPortraitSize from './checks/storyPosterPortraitSize';
import StoryTitleLength from './checks/storyTitleLength';
import VideoElementMissingPoster from './checks/videoElementMissingPoster';
import { ChecklistCategoryProvider, CHECK_CATEGORY } from './checkCountContext';

export function PriorityChecks() {
  return (
    <ChecklistCategoryProvider category={CHECK_CATEGORY.priority}>
      <div>
        <StoryMissingTitle />
        <StoryTitleLength />
        <StoryMissingExcerpt />
        <StoryPosterAttached />
        <StoryPosterPortraitSize />
        <StoryPosterAspectRatio />
        <PublisherLogoSize />
        <VideoElementMissingPoster />
      </div>
    </ChecklistCategoryProvider>
  );
}
