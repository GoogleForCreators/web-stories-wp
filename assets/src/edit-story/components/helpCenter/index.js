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
import { useRef } from 'react';
import { useFeatures } from 'flagged';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import {
  theme as dsTheme,
  ThemeGlobals,
  useFocusOut,
} from '../../../design-system';
import { Navigator } from './navigator';
import { Companion } from './companion';
import { Toggle } from './toggle';
import { useHelpCenter } from './useHelpCenter';
import { Popup } from './popup';

const Wrapper = styled.div`
  position: absolute;
  bottom: 16px;
  left: 12px;
  z-index: 10;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    bottom: 24px;
    left: 24px;
  }

  @media ${({ theme }) => theme.breakpoint.desktop} {
    bottom: 36px;
    left: 8px;
  }
`;

const POPUP_ID = 'help_center_companion';

export const HelpCenter = () => {
  const ref = useRef(null);
  const { enableQuickTips } = useFeatures();
  const { state, actions } = useHelpCenter();

  useFocusOut(ref, actions.close, []);

  return enableQuickTips ? (
    <ThemeProvider theme={dsTheme}>
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
              tipKey={state.navigationFlow[state.navigationIndex]}
              onTipSelect={actions.goToTip}
              isLeftToRightTransition={state.isLeftToRightTransition}
            />
          </Navigator>
        </Popup>
        <Toggle
          isOpen={state.isOpen}
          onClick={actions.toggle}
          notificationCount={1}
          popupId={POPUP_ID}
        />
      </Wrapper>
    </ThemeProvider>
  ) : null;
};
