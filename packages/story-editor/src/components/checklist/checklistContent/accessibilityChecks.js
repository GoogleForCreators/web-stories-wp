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
import { ChecklistCategoryProvider } from '../countContext';
import { PanelText, StyledTablistPanel } from '../styles';
import VideoOptimizationToggle from '../videoOptimizationCheckbox';
import { useIsChecklistMounted } from '../popupMountedContext';
import { useConfig } from '../../../app';
import {
  ElementLinkTappableRegionTooSmall,
  ElementLinkTappableRegionTooBig,
  ImageElementMissingAlt,
  PageBackgroundTextLowContrast,
  TextElementFontSizeTooSmall,
  VideoElementMissingCaptions,
  VideoElementMissingDescription,
} from '../checks';

function AccessibilityPanel({
  children,
  badgeCount,
  isOpen,
  onClick,
  maxHeight,
  title,
}) {
  const isChecklistMounted = useIsChecklistMounted();
  return isChecklistMounted ? (
    <StyledTablistPanel
      badgeCount={badgeCount}
      isExpanded={Boolean(badgeCount) && isOpen}
      onClick={onClick}
      maxHeight={maxHeight}
      title={title}
    >
      <PanelText>
        {__('Make your Web Story accessible.', 'web-stories')}
      </PanelText>
      {children}
    </StyledTablistPanel>
  ) : (
    children
  );
}

AccessibilityPanel.propTypes = {
  badgeCount: PropTypes.number,
  isOpen: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

export function AccessibilityChecks(props) {
  const { hasUploadMediaAction } = useConfig(({ capabilities }) => ({
    hasUploadMediaAction: capabilities.hasUploadMediaAction,
  }));

  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.ACCESSIBILITY}>
      <AccessibilityPanel {...props}>
        <VideoOptimizationToggle />
        <PageBackgroundTextLowContrast />
        <TextElementFontSizeTooSmall />
        <VideoElementMissingDescription />
        {hasUploadMediaAction && <VideoElementMissingCaptions />}
        <ElementLinkTappableRegionTooSmall />
        <ElementLinkTappableRegionTooBig />
        <ImageElementMissingAlt />
      </AccessibilityPanel>
    </ChecklistCategoryProvider>
  );
}
AccessibilityChecks.propTypes = {
  badgeCount: PropTypes.number,
  isOpen: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
