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
import { ISSUE_TYPES } from '../constants';
import {
  ChecklistCategoryProvider,
  useCategoryCount,
} from '../countContext/checkCountContext';
import { PanelText, StyledTablistPanel } from '../styles';
import StoryAmpValidationErrors from '../checks/storyAmpValidationErrors';

export function DistributionChecks({
  badgeCount = 0,
  maxHeight,
  isOpen,
  onClick,
  title,
}) {
  const priorityCount = useCategoryCount(ISSUE_TYPES.PRIORITY);
  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.DISTRIBUTION}>
      <StyledTablistPanel
        badgeCount={priorityCount === 0 ? badgeCount : 0}
        isExpanded={isOpen}
        onClick={onClick}
        maxHeight={maxHeight}
        title={title}
      >
        <PanelText>
          {__('Make your Web Story distributable.', 'web-stories')}
        </PanelText>
        <StoryAmpValidationErrors />
      </StyledTablistPanel>
    </ChecklistCategoryProvider>
  );
}
DistributionChecks.propTypes = {
  badgeCount: PropTypes.number,
  isOpen: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
