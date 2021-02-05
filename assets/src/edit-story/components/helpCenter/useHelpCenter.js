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
/**
 * Internal dependencies
 */
import { clamp } from '../../../animation';
import { useAPI } from '../../app';
import { DONE_TIP_ENTRY, NAVIGATION_FLOW } from './constants';

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
  key.split(' ').reduce(
    (accum, keyName) => ({
      ...accum,
      [keyName]: true,
    }),
    {}
  );

/**
 * Performs any state updates that result from
 * inspection of previous or next state
 *
 * @param {*} previous - previous state
 * @param {*} next - next state
 * @return {*} partial of state
 */
export const deriveState = (previous, next) => {
  const isMenuIndex = next.navigationIndex < 0;
  const isDoneIndex =
    next.navigationFlow?.indexOf(DONE_TIP_ENTRY[0]) === next.navigationIndex;

  const readTipKey =
    !isDoneIndex &&
    !isMenuIndex &&
    next.navigationFlow &&
    next.navigationFlow[next.navigationIndex];

  const isLTRTransition = next.navigationIndex - previous.navigationIndex > 0;

  const derivedState = {
    readTips: {
      ...previous.readTips,
      ...next.readTips,
      ...(readTipKey ? { [readTipKey]: true } : {}),
    },
    hasBottomNavigation: !isMenuIndex,
    isLeftToRightTransition: !isMenuIndex && isLTRTransition,
    isPrevDisabled: next.navigationIndex <= 0,
    isNextDisabled: next.navigationIndex >= next.navigationFlow?.length - 1,
  };

  return derivedState;
};

const reducer = ({ state, actions }, action) => {
  const nextState = { ...state, ...action(state) };
  return {
    state: { ...nextState, ...deriveState(state, nextState) },
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
    toggle: () => ({ isOpen }) => ({ isOpen: !isOpen }),
    close: () => () => ({ isOpen: false }),
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

export function useHelpCenter() {
  const [store, dispatch] = useReducer(reducer, initial);
  const { getCurrentUser, updateCurrentUser } = useAPI(({ actions }) => ({
    getCurrentUser: actions.getCurrentUser,
    updateCurrentUser: actions.updateCurrentUser,
  }));

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
    let isMounted = true;
    getCurrentUser()
      .then(({ meta }) => {
        isMounted &&
          actions.hydrateReadTipsSuccess({
            readTips: meta.web_stories_onboarding ?? {},
          });
      })
      .catch(actions.persitingReadTipsError);
    return () => (isMounted = false);
  }, [actions, getCurrentUser]);

  const persistenceKey = createKeyFromBooleanMap(store.state.readTips);
  useEffect(() => {
    updateCurrentUser({
      meta: { web_stories_onboarding: createBooleanMapFromKey(persistenceKey) },
    }).catch(actions.persitingReadTipsError);
  }, [actions, updateCurrentUser, persistenceKey]);

  // Components wrapped in a Transition no longer recieve
  // prop updates once they start exiting. To work around
  // this, we're passing them all state they need to
  // initialize their animations, then scheduling the
  // state update that causes them to transition 1 render
  // after they recieve those transition initializing props.
  const [nextRenderState, setNextRenderState] = useState(store.state);
  useEffect(() => setNextRenderState(store.state), [store.state]);
  const { navigationIndex } = nextRenderState;

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
