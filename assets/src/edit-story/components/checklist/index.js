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
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useFocusOut } from '@web-stories-wp/design-system';
import { FOCUSABLE_SELECTORS } from '../../constants';
import { useHelpCenter } from '../../app';
import DirectionAware from '../directionAware';
import { Popup } from '../helpCenter/popup';
import { NavigationWrapper } from '../helpCenter/navigator';
import { TopNavigation } from '../helpCenter/navigator/topNavigation';
import { Z_INDEX } from '../canvas/layout';
import { Toggle } from './toggle';
import { POPUP_ID } from './constants';
import { DesignChecks } from './designChecks';
import { AccessibilityChecks } from './accessibilityChecks';
import { PriorityChecks } from './priorityChecks';

const Wrapper = styled.div`
  /**
   * sibling inherits parent z-index of Z_INDEX.EDIT
   * so this needs to be placed above that while still
   * retaining its position in the DOM for focus purposes
   */
  z-index: ${Z_INDEX.EDIT + 1};
`;

export function Checklist() {
  const navRef = useRef();
  const wrapperRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { close: closeHelpCenter } = useHelpCenter(
    ({ actions: { close }, state: { isOpen: isHelpCenterOpen } }) => ({
      close,
      isHelpCenterOpen,
    })
  );

  // Set Focus within the popup on open
  useEffect(() => {
    if (isOpen) {
      const firstFocusableChild = navRef.current?.querySelector(
        FOCUSABLE_SELECTORS.join(', ')
      );
      firstFocusableChild?.focus();
    }
  }, [isOpen]);

  // Close this popup when focus leaves
  // this also functions to close this popup
  // when either the help center or keyboard
  // actions are open.
  useFocusOut(wrapperRef, () => setIsOpen(false), []);

  return (
    <DirectionAware>
      <Wrapper ref={wrapperRef}>
        <Popup
          popupId={POPUP_ID}
          isOpen={isOpen}
          ariaLabel={__('Checklist', 'web-stories')}
        >
          <NavigationWrapper ref={navRef}>
            <TopNavigation
              onClose={() => setIsOpen(false)}
              label={__('Checklist', 'web-stories')}
              popupId={POPUP_ID}
            />
            <PriorityChecks />
            <DesignChecks />
            <AccessibilityChecks />
          </NavigationWrapper>
        </Popup>
        <Toggle
          isOpen={isOpen}
          onClick={() => {
            closeHelpCenter();
            setIsOpen((v) => !v);
          }}
          popupId={POPUP_ID}
        />
      </Wrapper>
    </DirectionAware>
  );
}
