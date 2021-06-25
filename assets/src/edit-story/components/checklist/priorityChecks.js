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
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { PANEL_STATES, TablistPanel } from '../tablist';
import { ISSUE_TYPES } from './constants';
import PublisherLogoSize from './checks/publisherLogoSize';
import StoryMissingExcerpt from './checks/storyMissingExerpt';
import StoryMissingTitle from './checks/storyMissingTitle';
import StoryPosterAspectRatio from './checks/storyPosterAspectRatio';
import { StoryPosterAttached } from './checks/storyPosterAttached';
import StoryPosterPortraitSize from './checks/storyPosterPortraitSize';
import StoryTitleLength from './checks/storyTitleLength';
import VideoElementMissingPoster from './checks/videoElementMissingPoster';
import {
  ChecklistCategoryProvider,
  useCategoryCount,
} from './checkCountContext';

export function PriorityChecks({ isOpen, onClick, title }) {
  const count = useCategoryCount(ISSUE_TYPES.PRIORITY);

  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.PRIORITY}>
      <TablistPanel
        badgeCount={count}
        isExpanded={isOpen}
        onClick={onClick}
        status={PANEL_STATES.DANGER}
        title={title}
      >
        <StoryMissingTitle />
        <StoryTitleLength />
        <StoryMissingExcerpt />
        <StoryPosterAttached />
        <StoryPosterPortraitSize />
        <StoryPosterAspectRatio />
        <PublisherLogoSize />
        <VideoElementMissingPoster />
      </TablistPanel>
    </ChecklistCategoryProvider>
  );
}
PriorityChecks.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
