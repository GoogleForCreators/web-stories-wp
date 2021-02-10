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
import { useReducer, useEffect, useState, useMemo } from 'react';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { clamp } from '../../../../animation';
import { useCurrentUser } from '../../../app';
import { NAVIGATION_FLOW, TRANSITION_DURATION } from '../constants';
import {
  createEffectRun,
  deriveBottomNavigation,
  deriveDisabledButtons,
  deriveReadTip,
  deriveTransitionDirection,
  resetNavigationIndexOnOpen,
} from './effects';

/**
 * Performs any state updates that result from
 * inspection of previous or next state
 *
 * @param {*} previous - previous state
 * @param {*} next - next state
 * @return {*} partial of state
 */
export const deriveState = createEffectRun(
  // Order matters here as effects run
  // sequentially and alter next state
  // one after the other.
  [
    resetNavigationIndexOnOpen,
    deriveBottomNavigation,
    deriveTransitionDirection,
    deriveDisabledButtons,
    deriveReadTip,
  ]
);

const reducer = ({ state, actions }, action) => {
  const nextState = { ...state, ...action(state) };
  return {
    state: deriveState(state, nextState),
    actions,
  };
};

const initial = {
  state: {
    isOpen: false,
    navigationIndex: -1,
    // @TODO make this dynamic based off of unread tips.
    navigationFlow: NAVIGATION_FLOW,
    isLeftToRightTransition: true,
    hasBottomNavigation: false,
    isPrevDisabled: true,
    isNextDisabled: false,
    readTips: {},
    readError: false,
  },
  // All actions are in the form: externalArgs -> state -> newStatePartial
  //
  // Actions should only update the part of state they directly effect.
  // If there are state updates from deriving a value off of prevState
  // or nextState, place them in `deriveState(previous, next)` above.
  actions: {
    goToNext: () => ({ navigationIndex, navigationFlow }) => ({
      navigationIndex: clamp(navigationIndex + 1, [
        0,
        navigationFlow.length - 1,
      ]),
    }),
    goToPrev: () => ({ navigationIndex, navigationFlow }) => ({
      navigationIndex: clamp(navigationIndex - 1, [
        0,
        navigationFlow.length - 1,
      ]),
    }),
    goToMenu: () => () => ({ navigationIndex: -1 }),
    goToTip: (key) => ({ navigationFlow }) => ({
      navigationIndex: navigationFlow.findIndex((v) => v === key),
    }),
    toggle: () => ({ isOpen }) => {
      trackEvent('help_center_toggled', 'editor', null, null, {
        status: isOpen ? 'closed' : 'open',
      });
      return { isOpen: !isOpen };
    },
    close: () => () => {
      trackEvent('help_center_toggled', 'editor', null, null, {
        status: 'closed',
      });
      return { isOpen: false };
    },
    hydrateReadTipsSuccess: (payload) => (state) => ({
      readTips: {
        ...(payload?.readTips ?? {}),
        ...state.readTips,
      },
    }),
    persistingReadTipsError: () => () => ({
      readError: true,
    }),
  },
};

/**
 * Turns a boolean map into a string key
 *
 * @param {Object} map an object to stringify
 * @return {string} a key to provide to useEffect
 */
const createKeyFromBooleanMap = (map) => Object.keys(map || {}).join(' ');

/**
 * reforms the boolean map from the key returned by createKeyFromBooleanMap
 *
 * @param {string} key a string of space-separated map keys
 * @return {Object} the map of the provided keys with with true as the value
 */
const createBooleanMapFromKey = (key) =>
  key
    .split(' ')
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (accum, keyName) => ({
        ...accum,
        [keyName]: true,
      }),
      {}
    );

export function useHelpCenter() {
  const [store, dispatch] = useReducer(reducer, initial);
  const { currentUser, updateCurrentUser } = useCurrentUser(
    ({ state, actions }) => ({
      currentUser: state.currentUser,
      updateCurrentUser: actions.updateCurrentUser,
    })
  );

  // Wrap all actions in dispatch
  const actions = useMemo(
    () =>
      Object.entries(store.actions).reduce((accum, [key, action]) => {
        accum[key] = (...args) => dispatch(action(...args));
        return accum;
      }, {}),
    [store.actions]
  );

  useEffect(() => {
    actions.hydrateReadTipsSuccess({
      readTips: currentUser?.meta?.web_stories_onboarding ?? {},
    });
  }, [actions, currentUser]);

  const persistenceKey = createKeyFromBooleanMap(store.state.readTips);
  useEffect(() => {
    if (!persistenceKey) {
      return () => {};
    }
    // The call to `updateCurrentUser` causes the entire app to rerender
    // which causes noticable jank in our transition. This is just
    // a short term fix to not have that render occur during
    // the transition.
    const id = setTimeout(
      () =>
        updateCurrentUser({
          meta: {
            web_stories_onboarding: createBooleanMapFromKey(persistenceKey),
          },
        }).catch(actions.persistingReadTipsError),
      TRANSITION_DURATION
    );
    return () => clearTimeout(id);
  }, [actions, updateCurrentUser, persistenceKey]);

  // Components wrapped in a Transition no longer receive
  // prop updates once they start exiting. To work around
  // this, we're passing them all state they need to
  // initialize their animations, then scheduling the
  // state update that causes them to transition 1 render
  // after they receive those transition initializing props.
  const [nextRenderState, setNextRenderState] = useState(store.state);
  useEffect(() => setNextRenderState(store.state), [store.state]);

  // Check whether the popup is opening, if so
  // we want to use the state on this render
  // to avoid a tip -> menu transition when opening,
  // otherwise, while we're in the nav, we want to
  // see the transition so we use navigation index
  // from the next render
  const navigationIndex =
    !nextRenderState.isOpen && store.state.isOpen
      ? store.state.navigationIndex
      : nextRenderState.navigationIndex;

  useEffect(() => {
    if (
      navigationIndex > -1 &&
      store.state.navigationFlow.length >= navigationIndex
    ) {
      const currentTip = store.state.navigationFlow[navigationIndex];
      // navigation includes 'done' which does not get marked read
      const unreadCount =
        store.state.navigationFlow.length -
        Object.keys(store.state.readTips).length -
        1;

      trackEvent('help_center_read_tip', 'editor', currentTip, null, {
        unread_count: unreadCount,
      });
    }
    // Disable reason: avoid sending duplicate tracking events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationIndex]);

  return useMemo(
    () => ({
      state: {
        ...store.state,
        navigationIndex,
      },
      actions,
    }),
    [actions, store.state, navigationIndex]
  );
}
