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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { PANEL_STATES } from '../tablist';
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
import { PanelText, StyledTablistPanel } from './styles';

export function PriorityChecks({ isOpen, onClick, title }) {
  const count = useCategoryCount(ISSUE_TYPES.PRIORITY);

  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.PRIORITY}>
      <StyledTablistPanel
        badgeCount={count}
        isExpanded={isOpen}
        onClick={onClick}
        status={PANEL_STATES.DANGER}
        title={title}
      >
        <PanelText>
          {__('Make this Web Story easier to discover.', 'web-stories')}
        </PanelText>
        <StoryMissingTitle />
        <StoryTitleLength />
        <StoryMissingExcerpt />
        <StoryPosterAttached />
        <StoryPosterPortraitSize />
        <StoryPosterAspectRatio />
        <PublisherLogoSize />
        <VideoElementMissingPoster />
      </StyledTablistPanel>
    </ChecklistCategoryProvider>
  );
}
PriorityChecks.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
