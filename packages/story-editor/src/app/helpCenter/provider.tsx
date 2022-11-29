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
import { useEffect, useState, useMemo, useRef } from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';
import { trackEvent } from '@googleforcreators/tracking';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useCurrentUser } from '../currentUser';
import { useAPI } from '../api';
import Context from './context';
import useHelpCenterReducer from './useHelpCenterReducer';
import type { HelpCenterState } from './types';

/**
 * Turns a boolean map into a string key
 *
 * @param map an object to stringify
 * @return a key to provide to useEffect
 */
const createKeyFromBooleanMap = (map: Record<string, boolean>) =>
  Object.keys(map || {}).join(' ');

/**
 * reforms the boolean map from the key returned by createKeyFromBooleanMap
 *
 * @param key a string of space-separated map keys
 * @return the map of the provided keys with with true as the value
 */
const createBooleanMapFromKey = (key: string) =>
  Object.fromEntries(
    key
      .split(' ')
      .sort((a, b) => a.localeCompare(b))
      .map((keyName) => [keyName, true])
  );

function HelpCenterProvider({ children }: PropsWithChildren<unknown>) {
  const {
    actions: { updateCurrentUser: _updateCurrentUser },
  } = useAPI();
  const canUpdateCurrentUser = Boolean(_updateCurrentUser);
  const { currentUser, updateCurrentUser } = useCurrentUser(
    ({ state, actions }) => ({
      currentUser: state.currentUser,
      updateCurrentUser: actions.updateCurrentUser,
    })
  );
  const { state, actions } = useHelpCenterReducer();

  // Once app is hydrated, start persisting unreadTips
  const { isHydrated, unreadTipsCount } = state;
  useEffect(() => {
    if (isHydrated) {
      const local = localStore.getItemByKey(
        LOCAL_STORAGE_PREFIX.HELP_CENTER
      ) as Partial<HelpCenterState>;
      localStore.setItemByKey(LOCAL_STORAGE_PREFIX.HELP_CENTER, {
        ...local,
        unreadTipsCount,
      });
    }
  }, [isHydrated, unreadTipsCount]);

  // Persist user updates to isOpen
  const { isOpen } = state;
  useEffect(() => {
    const local = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX.HELP_CENTER
    ) as Partial<HelpCenterState>;
    localStore.setItemByKey(LOCAL_STORAGE_PREFIX.HELP_CENTER, {
      ...local,
      isOpen,
    });
  }, [isOpen]);

  // Hydrate unread tips once from current user endpoint.
  useEffect(() => {
    if (!isHydrated && currentUser?.onboarding) {
      actions.hydrateReadTipsSuccess({
        readTips: currentUser.onboarding,
      });
    }
  }, [actions, currentUser, isHydrated]);

  const persistenceKey = createKeyFromBooleanMap(state.readTips);
  const isInitialHydrationUpdate = useRef(false);
  useEffect(() => {
    if ((!persistenceKey && !isHydrated) || !canUpdateCurrentUser) {
      return;
    }

    // We don't want to persist when the update is from
    // the initial hydrate call
    if (!isInitialHydrationUpdate.current) {
      isInitialHydrationUpdate.current = true;
      return;
    }
    updateCurrentUser({
      onboarding: createBooleanMapFromKey(persistenceKey),
    })?.catch(actions.persistingReadTipsError);
  }, [
    actions,
    updateCurrentUser,
    canUpdateCurrentUser,
    persistenceKey,
    isHydrated,
  ]);

  // Components wrapped in a Transition no longer receive
  // prop updates once they start exiting. To work around
  // this, we're passing them all state they need to
  // initialize their animations, then scheduling the
  // state update that causes them to transition 1 render
  // after they receive those transition initializing props.
  const [nextRenderState, setNextRenderState] = useState(state);
  useEffect(() => setNextRenderState(state), [state]);

  // Check whether the popup is opening, if so
  // we want to use the state on this render
  // to avoid a tip -> menu transition when opening,
  // otherwise, while we're in the nav, we want to
  // see the transition so we use navigation index
  // from the next render
  const navigationIndex =
    !nextRenderState.isOpen && state.isOpen
      ? state.navigationIndex
      : nextRenderState.navigationIndex;

  useEffect(() => {
    if (
      navigationIndex > -1 &&
      state.navigationFlow.length >= navigationIndex
    ) {
      const currentTip = state.navigationFlow[navigationIndex];
      void trackEvent('help_center_read_tip', {
        name: currentTip,
        unread_count: state.unreadTipsCount,
      });

      if (state.unreadTipsCount === state.navigationFlow.length) {
        void trackEvent('tutorial_begin');
      }

      if ('done' === currentTip) {
        void trackEvent('tutorial_complete');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid sending duplicate tracking events.
  }, [navigationIndex]);

  const contextValue = useMemo(
    () => ({
      state: {
        ...state,
        navigationIndex,
      },
      actions,
    }),
    [actions, state, navigationIndex]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default HelpCenterProvider;
