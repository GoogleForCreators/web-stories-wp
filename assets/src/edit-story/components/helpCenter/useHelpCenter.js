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
import { useReducer, useEffect, useState, useMemo, useCallback } from 'react';
/**
 * Internal dependencies
 */
import { clamp } from '../../../animation';
import { useAPI } from '../../app';
import { DONE_TIP_ENTRY, NAVIGATION_FLOW } from './constants';

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
  const isLTRTransition = next.navigationIndex - previous.navigationIndex > 0;

  return {
    hasBottomNavigation: !isMenuIndex,
    isLeftToRightTransition: !isMenuIndex && isLTRTransition,
    isPrevDisabled: next.navigationIndex <= 0,
    isNextDisabled: next.navigationIndex >= next.navigationFlow?.length - 1,
  };
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
    read: [],
    fetchError: false,
    readError: false,
    loading: false,
    updating: false,
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
    fetchReadStart: () => () => ({ loading: true }),
    fetchReadSuccess: (payload) => () => ({
      ...payload,
      loading: false,
    }),
    fetchReadError: () => () => ({
      fetchError: true,
      loading: false,
    }),
    read: (key) => ({ read }) => ({
      // optimistically update the notification as "read"
      read: read.indexOf(key) === -1 ? read.concat(key) : read,
      updating: true,
    }),
    readSuccess: () => () => ({
      updating: false,
    }),
    readError: (key) => ({ read }) => ({
      updating: false,
      readError: true,
      read: read.filter((tipKey) => tipKey !== key),
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

  const getReadTips = useCallback(async () => {
    try {
      actions.fetchReadStart();
      const { meta } = await getCurrentUser();

      actions.fetchReadSuccess({
        read: meta.web_stories_onboarding ?? [],
      });
    } catch {
      actions.fetchReadError();
    }
  }, [actions, getCurrentUser]);

  useEffect(() => {
    getReadTips();
  }, [getReadTips]);

  const updateReadStatus = useCallback(async () => {
    const currentKey = store.state.navigationFlow[store.state.navigationIndex];
    const [doneKey] = DONE_TIP_ENTRY;
    // if the current status is not 'read'
    if (
      currentKey &&
      store.state.read.indexOf(currentKey) === -1 &&
      currentKey !== doneKey
    ) {
      try {
        // optimistically mark it read
        // whether the update call succeeds or not
        actions.read(currentKey);
        await updateCurrentUser({
          meta: {
            web_stories_onboarding: [...store.state.read, currentKey],
          },
        });
        actions.readSuccess();
      } catch (e) {
        actions.readError(currentKey);
      }
    }
  }, [store, actions, updateCurrentUser]);

  useEffect(() => {
    updateReadStatus();
  }, [updateReadStatus, store.state.navigationIndex]);

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
