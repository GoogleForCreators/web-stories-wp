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
import { useEffect } from 'react';
/**
 * Internal dependencies
 */
import { useConfig } from '../../../app';
import useFFmpeg from '../../../app/media/utils/useFFmpeg';
import { PANEL_STATES } from '../../tablist';
import { ISSUE_TYPES, PANEL_VISIBILITY_BY_STATE } from '../constants';
import PublisherLogoSize from '../checks/publisherLogoSize';
import StoryMissingExcerpt from '../checks/storyMissingExerpt';
import StoryMissingTitle from '../checks/storyMissingTitle';
import StoryPosterAspectRatio from '../checks/storyPosterAspectRatio';
import { StoryPosterAttached } from '../checks/storyPosterAttached';
import StoryPosterPortraitSize from '../checks/storyPosterPortraitSize';
import StoryTitleLength from '../checks/storyTitleLength';
import VideoElementMissingPoster from '../checks/videoElementMissingPoster';
import { ChecklistCategoryProvider, useCategoryCount } from '../countContext';
import { PanelText, StyledTablistPanel } from '../styles';
import { useCheckpoint } from '../checkpointContext';
import VideoOptimization from '../checks/videoOptimization';

export function PriorityChecks({ isOpen, onClick, title }) {
  const count = useCategoryCount(ISSUE_TYPES.PRIORITY);
  const { updateHighPriorityCount, checkpoint } = useCheckpoint(
    ({ actions: { updateHighPriorityCount }, state: { checkpoint } }) => ({
      checkpoint,
      updateHighPriorityCount,
    })
  );
  useEffect(() => {
    updateHighPriorityCount(count);
  }, [updateHighPriorityCount, count]);

  const isCheckpointMet = PANEL_VISIBILITY_BY_STATE[checkpoint].includes(
    ISSUE_TYPES.PRIORITY
  );

  const { isFeatureEnabled, isTranscodingEnabled } = useFFmpeg();
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const isVideoOptimizationSettingEnabled =
    isFeatureEnabled && isTranscodingEnabled && hasUploadMediaAction;

  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.PRIORITY}>
      <StyledTablistPanel
        badgeCount={isCheckpointMet ? count : 0}
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
        {/* TODO: #8129 this overlaps alot with aspect ratio, do we need both? */}
        <StoryPosterPortraitSize />
        <StoryPosterAspectRatio />
        <PublisherLogoSize />
        <VideoElementMissingPoster />
        {isVideoOptimizationSettingEnabled && <VideoOptimization />}
      </StyledTablistPanel>
    </ChecklistCategoryProvider>
  );
}

PriorityChecks.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
