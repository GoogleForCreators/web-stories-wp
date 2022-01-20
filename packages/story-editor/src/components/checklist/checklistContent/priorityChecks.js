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
import { useEffect } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { PANEL_STATES } from '../../tablist';
import { ISSUE_TYPES } from '../constants';
import { ChecklistCategoryProvider, useCategoryCount } from '../countContext';
import { PanelText, StyledTablistPanel } from '../styles';
import { useCheckpoint } from '../checkpointContext';
import { useIsChecklistMounted } from '../popupMountedContext';

function PriorityPanel({
  children,
  badgeCount = 0,
  isOpen,
  onClick,
  maxHeight,
  title,
}) {
  const isChecklistMounted = useIsChecklistMounted();
  return isChecklistMounted ? (
    <StyledTablistPanel
      badgeCount={badgeCount}
      isExpanded={badgeCount && isOpen}
      onClick={onClick}
      maxHeight={maxHeight}
      status={PANEL_STATES.DANGER}
      title={title}
    >
      <PanelText>
        {__('Make this Web Story easier to discover.', 'web-stories')}
      </PanelText>
      {children}
    </StyledTablistPanel>
  ) : (
    children
  );
}

PriorityPanel.propTypes = {
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

export function PriorityChecks(props) {
  const count = useCategoryCount(ISSUE_TYPES.PRIORITY);
  const { updateHighPriorityCount } = useCheckpoint(
    ({ actions: { updateHighPriorityCount } }) => ({
      updateHighPriorityCount,
    })
  );

  useEffect(() => {
    updateHighPriorityCount(count);
  }, [updateHighPriorityCount, count]);

  return (
    <ChecklistCategoryProvider category={ISSUE_TYPES.PRIORITY}>
      <PriorityPanel {...props}>{props.children}</PriorityPanel>
    </ChecklistCategoryProvider>
  );
}

PriorityChecks.propTypes = {
  badgeCount: PropTypes.number,
  isOpen: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
