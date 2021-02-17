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
import { useRef, useEffect } from 'react';
import { useFeatures } from 'flagged';
import styled, { StyleSheetManager } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';

/**
 * Internal dependencies
 */
import { ThemeGlobals, useFocusOut } from '../../../design-system';
import { useConfig } from '../../app/config';
import { Z_INDEX } from '../canvas/layout';
import { Navigator } from './navigator';
import { Companion } from './companion';
import { POPUP_ID } from './constants';
import { Toggle } from './toggle';
import { useHelpCenter } from './useHelpCenter';
import { Popup } from './popup';
import { forceFocusCompanion } from './utils';

const Wrapper = styled.div`
  position: absolute;
  bottom: 16px;
  left: 8px;
  /**
   * sibling inherits parent z-index of Z_INDEX.EDIT
   * so this needs to be placed above that while still
   * retaining its postion in the DOM for focus purposes
   */
  z-index: ${Z_INDEX.EDIT + 1};
`;

const withRTLPlugins = [stylisRTLPlugin];
const withoutRTLPlugins = [];

export const HelpCenter = () => {
  const { isRTL } = useConfig();
  const ref = useRef(null);
  const { enableQuickTips } = useFeatures();
  const { state, actions } = useHelpCenter();

  useFocusOut(ref, actions.close, []);

  // Set Focus on the expanded companion
  // whenever it opens
  useEffect(() => {
    if (state.isOpen) {
      forceFocusCompanion();
    }
  }, [state.isOpen]);

  return enableQuickTips ? (
    <StyleSheetManager
      stylisPlugins={isRTL ? withRTLPlugins : withoutRTLPlugins}
    >
      <>
        <ThemeGlobals.OverrideFocusOutline />
        <Wrapper ref={ref}>
          <Popup popupId={POPUP_ID} isOpen={state.isOpen}>
            <Navigator
              onNext={actions.goToNext}
              onPrev={actions.goToPrev}
              onAllTips={actions.goToMenu}
              onClose={actions.close}
              hasBottomNavigation={state.hasBottomNavigation}
              isNextDisabled={state.isNextDisabled}
              isPrevDisabled={state.isPrevDisabled}
            >
              <Companion
                readTips={state.readTips}
                tipKey={state.navigationFlow[state.navigationIndex]}
                onTipSelect={actions.goToTip}
                isLeftToRightTransition={state.isLeftToRightTransition}
              />
            </Navigator>
          </Popup>
          <Toggle
            isOpen={state.isOpen}
            onClick={actions.toggle}
            notificationCount={state.unreadTipsCount}
            popupId={POPUP_ID}
          />
        </Wrapper>
      </>
    </StyleSheetManager>
  ) : null;
};
