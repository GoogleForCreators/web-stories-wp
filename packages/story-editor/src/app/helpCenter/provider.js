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
import PropTypes from 'prop-types';
import {
  useReducer,
  useEffect,
  useState,
  useMemo,
  useRef,
} from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { clamp } from '@googleforcreators/units';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useCurrentUser } from '../currentUser';
import { TIPS } from '../../components/helpCenter/constants';
import { useConfig } from '../config';
import { useAPI } from '../api';
import Context from './context';
import {
  composeEffects,
  createDynamicNavigationFlow,
  deriveBottomNavigation,
  deriveDisabledButtons,
  deriveReadTip,
  deriveTransitionDirection,
  deriveUnreadTipsCount,
  resetNavigationIndexOnOpen,
  deriveAutoOpen,
  deriveInitialOpen,
  deriveInitialUnreadTipsCount,
  resetIsOpeningToTip,
} from './useHelpCenter/effects';

/**
 * Performs any state updates that result from
 * inspection of previous or next state
 *
 * @param {*} previous - previous state
 * @param {*} next - next state
 * @return {*} partial of state
 */
export const deriveState = composeEffects(
  // Order matters here as effects run
  // sequentially and alter next state
  // one after the other.
  [
    resetNavigationIndexOnOpen,
    createDynamicNavigationFlow,
    deriveBottomNavigation,
    deriveTransitionDirection,
    deriveDisabledButtons,
    deriveReadTip,
    deriveUnreadTipsCount,
    deriveAutoOpen,
    resetIsOpeningToTip,
  ]
);

const reducer = ({ state, actions }, action) => {
  const nextState = { ...state, ...action(state) };
  return {
    state: deriveState(state, nextState),
    actions,
  };
};

const deriveInitialState = composeEffects([
  deriveInitialOpen,
  deriveInitialUnreadTipsCount,
]);

const persisted = localStore.getItemByKey(LOCAL_STORAGE_PREFIX.HELP_CENTER);

export const getInitialState = (additionalInitialState) => ({
  isOpen: false,
  isOpeningToTip: false,
  navigationIndex: -1,
  navigationFlow: Object.keys({
    ...TIPS,
    ...additionalInitialState.additionalTips,
  }), // Is updated using createDynamicNavigationFlow effect.
  isLeftToRightTransition: true,
  hasBottomNavigation: false,
  isPrevDisabled: true,
  isNextDisabled: false,
  readTips: {},
  readError: false,
  unreadTipsCount: persisted?.unreadTipsCount ?? 0,
  isHydrated: false,
  tips: { ...TIPS, ...additionalInitialState.additionalTips },
  tipKeys: Object.keys({ ...TIPS, ...additionalInitialState.additionalTips }),
});

export const getInitial = (additionalInitialState) => ({
  state: deriveInitialState(persisted, getInitialState(additionalInitialState)),
  // All actions are in the form: externalArgs -> state -> newStatePartial
  //
  // Actions should only update the part of state they directly effect.
  // If there are state updates from deriving a value off of prevState
  // or nextState, place them in `deriveState(previous, next)` above.
  actions: {
    goToNext:
      () =>
      ({ navigationIndex, navigationFlow }) => ({
        navigationIndex: clamp(navigationIndex + 1, {
          MIN: 0,
          MAX: navigationFlow.length - 1,
        }),
      }),
    goToPrev:
      () =>
      ({ navigationIndex, navigationFlow }) => ({
        navigationIndex: clamp(navigationIndex - 1, {
          MIN: 0,
          MAX: navigationFlow.length - 1,
        }),
      }),
    goToMenu: () => () => ({ navigationIndex: -1 }),
    goToTip:
      (key) =>
      ({ navigationFlow }) => ({
        navigationIndex: navigationFlow.findIndex((v) => v === key),
      }),
    openToUnreadTip:
      (key) =>
      ({ navigationFlow, readTips }) =>
        !readTips[key]
          ? {
              isOpen: true,
              isOpeningToTip: true,
              navigationIndex: navigationFlow.findIndex((v) => v === key),
            }
          : {},
    toggle:
      () =>
      ({ isOpen }) => {
        trackEvent('help_center_toggled', {
          status: isOpen ? 'closed' : 'open',
        });
        return { isOpen: !isOpen };
      },
    close:
      () =>
      ({ isOpen }) => {
        if (isOpen) {
          trackEvent('help_center_toggled', {
            status: 'closed',
          });
        }
        return { isOpen: false };
      },
    hydrateReadTipsSuccess: (payload) => (state) => ({
      readTips: {
        ...(payload?.readTips ?? {}),
        ...state.readTips,
      },
      isHydrated: true,
    }),
    persistingReadTipsError: () => () => ({
      readError: true,
    }),
  },
});

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

function HelpCenterProvider({ children }) {
  const { additionalTips = {} } = useConfig();
  const {
    actions: { updateCurrentUser: _updateCurrentUser },
  } = useAPI();
  const canUpdateCurrentUser = Boolean(_updateCurrentUser);
  const [store, dispatch] = useReducer(reducer, getInitial({ additionalTips }));
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

  // Once app is hydrated, start persisting unreadTips
  const { isHydrated, unreadTipsCount } = store.state;
  useEffect(() => {
    if (isHydrated) {
      const local = localStore.getItemByKey(LOCAL_STORAGE_PREFIX.HELP_CENTER);
      localStore.setItemByKey(LOCAL_STORAGE_PREFIX.HELP_CENTER, {
        ...local,
        unreadTipsCount,
      });
    }
  }, [isHydrated, unreadTipsCount]);

  // Persist user updates to isOpen
  const { isOpen } = store.state;
  useEffect(() => {
    const local = localStore.getItemByKey(LOCAL_STORAGE_PREFIX.HELP_CENTER);
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

  const persistenceKey = createKeyFromBooleanMap(store.state.readTips);
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
    }).catch(actions.persistingReadTipsError);
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
      trackEvent('help_center_read_tip', {
        name: currentTip,
        unread_count: store.state.unreadTipsCount,
      });

      if (store.state.unreadTipsCount === store.state.navigationFlow.length) {
        trackEvent('tutorial_begin');
      }

      if ('done' === currentTip) {
        trackEvent('tutorial_complete');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid sending duplicate tracking events.
  }, [navigationIndex]);

  const contextValue = useMemo(
    () => ({
      state: {
        ...store.state,
        navigationIndex,
      },
      actions,
    }),
    [actions, store.state, navigationIndex]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

HelpCenterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HelpCenterProvider;
