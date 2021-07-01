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
import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { FOCUSABLE_SELECTORS } from '../../constants';
import DirectionAware from '../directionAware';
import { Popup } from '../helpCenter/popup';
import { NavigationWrapper } from '../helpCenter/navigator';
import { TopNavigation } from '../helpCenter/navigator/topNavigation';
import { Z_INDEX } from '../canvas/layout';
import { Tablist } from '../tablist';
import { Toggle } from './toggle';
import {
  CATEGORY_LABELS,
  CHECKLIST_TITLE,
  ISSUE_TYPES,
  POPUP_ID,
} from './constants';
import { DesignChecks } from './designChecks';
import { AccessibilityChecks } from './accessibilityChecks';
import { PriorityChecks } from './priorityChecks';
import { ChecklistCountProvider } from './checkCountContext';
import EmptyContentCheck from './emptyContent';
import { useChecklist } from './context';

const Wrapper = styled.div`
  /**
   * sibling inherits parent z-index of Z_INDEX.EDIT
   * so this needs to be placed above that while still
   * retaining its position in the DOM for focus purposes
   */
  z-index: ${Z_INDEX.EDIT + 1};
`;

export function Checklist() {
  const { close, toggle, isOpen } = useChecklist(
    ({ actions: { close, toggle }, state: { isOpen } }) => ({
      close,
      toggle,
      isOpen,
    })
  );

  const [openPanel, setOpenPanel] = useState(null);
  const handleOpenPanel = useCallback(
    (panelName) => () =>
      setOpenPanel((currentOpenPanel) =>
        currentOpenPanel === panelName ? null : panelName
      ),
    []
  );
  const navRef = useRef();

  // Set Focus within the popup on open
  useEffect(() => {
    if (isOpen) {
      const firstFocusableChild = navRef.current?.querySelector(
        FOCUSABLE_SELECTORS.join(', ')
      );
      firstFocusableChild?.focus();
    }
  }, [isOpen]);

  return (
    <DirectionAware>
      <ChecklistCountProvider>
        <Wrapper role="region" aria-label={CHECKLIST_TITLE}>
          <Popup popupId={POPUP_ID} isOpen={isOpen} ariaLabel={CHECKLIST_TITLE}>
            <NavigationWrapper ref={navRef} isOpen={isOpen}>
              <TopNavigation
                onClose={close}
                label={CHECKLIST_TITLE}
                popupId={POPUP_ID}
              />
              <Tablist
                aria-label={__(
                  'Potential Story issues by category',
                  'web-stories'
                )}
              >
                <PriorityChecks
                  isOpen={openPanel === ISSUE_TYPES.PRIORITY}
                  onClick={handleOpenPanel(ISSUE_TYPES.PRIORITY)}
                  title={CATEGORY_LABELS[ISSUE_TYPES.PRIORITY]}
                />
                <DesignChecks
                  isOpen={openPanel === ISSUE_TYPES.DESIGN}
                  onClick={handleOpenPanel(ISSUE_TYPES.DESIGN)}
                  title={CATEGORY_LABELS[ISSUE_TYPES.DESIGN]}
                />
                <AccessibilityChecks
                  isOpen={openPanel === ISSUE_TYPES.ACCESSIBILITY}
                  onClick={handleOpenPanel(ISSUE_TYPES.ACCESSIBILITY)}
                  title={CATEGORY_LABELS[ISSUE_TYPES.ACCESSIBILITY]}
                />
              </Tablist>
              <EmptyContentCheck />
            </NavigationWrapper>
          </Popup>
          <Toggle isOpen={isOpen} onClick={toggle} popupId={POPUP_ID} />
        </Wrapper>
      </ChecklistCountProvider>
    </DirectionAware>
  );
}

export { ChecklistProvider, useChecklist } from './context';
