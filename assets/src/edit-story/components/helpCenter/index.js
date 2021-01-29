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
import { useReducer, useEffect, useState } from 'react';
import { useFeatures } from 'flagged';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { clamp } from '../../../animation';
import { theme as dsTheme, ThemeGlobals } from '../../../design-system';
import { TIPS, DONE_TIP_ENTRY } from './constants';
import { Navigator } from './navigator';
import { Companion } from './companion';
import { Toggle } from './toggle';

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

const Popup = styled.div`
  position: absolute;
  top: -8px;
`;

// @TODO make this dynamic based off of unread tips.
const NAVIGATION_FLOW = [...Object.keys(TIPS), DONE_TIP_ENTRY[0]];

const POPUP_ID = 'help_center_companion';

const reducer = (state, operation) => {
  const newState = { ...state, ...operation(state) };
  const isMenuIndex = newState.navigationIndex < 0;
  const isLTRTransition = newState.navigationIndex - state.navigationIndex > 0;
  return {
    ...newState,
    hasBottomNavigation: !isMenuIndex,
    isLeftToRightTransition: !isMenuIndex && isLTRTransition,
  };
};

export const HelpCenter = () => {
  const { enableQuickTips } = useFeatures();

  // @TODO move this into a provider so story
  // actions can trigger it as a side effect
  const [store, dispatch] = useReducer(reducer, {
    isOpen: false,
    navigationIndex: -1,
    isLeftToRightTransition: true,
    hasBottomNavigation: false,
    next: ({ navigationIndex, navigationFlow }) => ({
      navigationIndex: clamp(navigationIndex + 1, [
        0,
        navigationFlow.length - 1,
      ]),
    }),
    prev: ({ navigationIndex, navigationFlow }) => ({
      navigationIndex: clamp(navigationIndex - 1, [
        0,
        navigationFlow.length - 1,
      ]),
    }),
    menu: () => ({ navigationIndex: -1 }),
    goToTip: (key) => () => ({
      navigationIndex: NAVIGATION_FLOW.findIndex((v) => v === key),
    }),
    toggle: ({ isOpen }) => ({ isOpen: !isOpen }),
    close: () => ({ isOpen: false }),
    navigationFlow: NAVIGATION_FLOW,
  });

  const [nextRenderStore, setNextRenderStore] = useState(store);
  useEffect(() => setNextRenderStore(store), [store]);

  const { navigationIndex } = nextRenderStore;

  return enableQuickTips ? (
    <ThemeProvider theme={dsTheme}>
      <ThemeGlobals.OverrideFocusOutline />
      <Wrapper>
        <Popup id={POPUP_ID} isOpen={store.isOpen}>
          <Navigator
            onNext={() => dispatch(store.next)}
            onPrev={() => dispatch(store.prev)}
            onAllTips={() => dispatch(store.menu)}
            onClose={() => dispatch(store.close)}
            hasBottomNavigation={store.hasBottomNavigation}
          >
            <Companion
              displayKey={NAVIGATION_FLOW[navigationIndex]}
              onTipSelect={(key) => dispatch(store.goToTip(key))}
              isLeftToRightTransition={store.isLeftToRightTransition}
            />
          </Navigator>
        </Popup>
        <Toggle
          isOpen={store.isOpen}
          onClick={() => dispatch(store.toggle)}
          notificationCount={1}
          popupId={POPUP_ID}
        />
      </Wrapper>
    </ThemeProvider>
  ) : null;
};
