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
import { __ } from '@web-stories-wp/i18n';
import { ISSUE_TYPES, PANEL_VISIBILITY_BY_STATE } from '../constants';
import ElementLinkTappableRegionTooSmall from '../checks/elementLinkTappableRegionTooSmall';
import ImageElementMissingAlt from '../checks/imageElementMissingAlt';
import { PageBackgroundTextLowContrast } from '../checks/pageBackgroundLowTextContrast';
import TextElementFontSizeTooSmall from '../checks/textElementFontSizeTooSmall';
import VideoElementMissingCaptions from '../checks/videoElementMissingCaptions';
import VideoElementMissingDescription from '../checks/videoElementMissingDescription';
import { useCheckpoint } from '../checkpointContext';
import {
  ChecklistCategoryProvider,
  useCategoryCount,
} from '../countContext/checkCountContext';
import { PanelText, StyledTablistPanel } from '../styles';
import VideoOptimizationToggle from '../videoOptimizationCheckbox';

export function AccessibilityChecks({ isOpen, onClick, title }) {
  const count = useCategoryCount(ISSUE_TYPES.ACCESSIBILITY);
  const { checkpoint } = useCheckpoint(({ state: { checkpoint } }) => ({
    checkpoint,
  }));

  const isCheckpointMet = PANEL_VISIBILITY_BY_STATE[checkpoint].includes(
    ISSUE_TYPES.ACCESSIBILITY
  );

  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.ACCESSIBILITY}>
      <StyledTablistPanel
        badgeCount={isCheckpointMet ? count : 0}
        isExpanded={isOpen}
        onClick={onClick}
        title={title}
      >
        <PanelText>
          {__('Make your Web Story accessible.', 'web-stories')}
        </PanelText>
        <VideoOptimizationToggle />
        <PageBackgroundTextLowContrast />
        <TextElementFontSizeTooSmall />
        <VideoElementMissingDescription />
        <VideoElementMissingCaptions />
        <ElementLinkTappableRegionTooSmall />
        <ImageElementMissingAlt />
      </StyledTablistPanel>
    </ChecklistCategoryProvider>
  );
}
AccessibilityChecks.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
