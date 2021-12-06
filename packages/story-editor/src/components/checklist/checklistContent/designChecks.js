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
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { ISSUE_TYPES } from '../constants';
import { ChecklistCategoryProvider } from '../countContext';
import { PanelText, StyledTablistPanel } from '../styles';
import { useIsChecklistMounted } from '../popupMountedContext';

function DesignPanel({
  badgeCount = 0,
  isOpen,
  maxHeight,
  onClick,
  title,
  children,
}) {
  const isChecklistMounted = useIsChecklistMounted();
  return isChecklistMounted ? (
    <StyledTablistPanel
      badgeCount={badgeCount}
      isExpanded={badgeCount && isOpen}
      onClick={onClick}
      maxHeight={maxHeight}
      title={title}
    >
      <PanelText>
        {__('Follow best practices for Web Stories.', 'web-stories')}
      </PanelText>
      {children}
    </StyledTablistPanel>
  ) : (
    children
  );
}
DesignPanel.propTypes = {
  badgeCount: PropTypes.number,
  isOpen: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export function DesignChecks(props) {
  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.DESIGN}>
      <DesignPanel {...props}>{props.children}</DesignPanel>
    </ChecklistCategoryProvider>
  );
}
DesignChecks.propTypes = {
  badgeCount: PropTypes.number,
  isOpen: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
