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
import { useReducer, useMemo } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { clamp } from '@googleforcreators/units';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import type { Tip } from '../../types/configProvider';
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
import type {
  HelpCenterActions,
  HelpCenterReducerContext,
  HelpCenterState,
} from './types';
import { TIPS } from './constants';

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

const reducer = (
  { state, actions }: HelpCenterReducerContext,
  action: (state: HelpCenterState) => Partial<HelpCenterState>
): HelpCenterReducerContext => {
  const nextState = { ...state, ...action(state) };
  return {
    state: deriveState(state, nextState),
    actions,
  };
};

const deriveInitialState = composeEffects<
  Partial<HelpCenterState>,
  HelpCenterState
>([deriveInitialOpen, deriveInitialUnreadTipsCount]);

const persisted: Partial<HelpCenterState> = localStore.getItemByKey(
  LOCAL_STORAGE_PREFIX.HELP_CENTER
) as Partial<HelpCenterState>;

export const getInitialState = (
  additionalTips?: Record<string, Tip>
): HelpCenterState => ({
  isOpen: false,
  isOpeningToTip: false,
  navigationIndex: -1,
  navigationFlow: Object.keys({
    ...TIPS,
    ...additionalTips,
  }), // Is updated using createDynamicNavigationFlow effect.
  isLeftToRightTransition: true,
  hasBottomNavigation: false,
  isPrevDisabled: true,
  isNextDisabled: false,
  readTips: {},
  readError: false,
  unreadTipsCount: persisted?.unreadTipsCount ?? 0,
  isHydrated: false,
  tips: { ...TIPS, ...additionalTips },
  tipKeys: Object.keys({ ...TIPS, ...additionalTips }),
});

export const getInitial = (
  additionalTips?: Record<string, Tip>
): HelpCenterReducerContext => ({
  state: deriveInitialState(persisted, getInitialState(additionalTips)),
  // All actions are in the form: externalArgs -> state -> newStatePartial
  //
  // Actions should only update the part of state they directly effect.
  // If there are state updates from deriving a value off of prevState
  // or nextState, place them in `deriveState(previous, next)` above.
  actions: {
    goToNext:
      () =>
      ({ navigationIndex, navigationFlow }: HelpCenterState) => ({
        navigationIndex: clamp(navigationIndex + 1, {
          MIN: 0,
          MAX: navigationFlow.length - 1,
        }),
      }),
    goToPrev:
      () =>
      ({ navigationIndex, navigationFlow }: HelpCenterState) => ({
        navigationIndex: clamp(navigationIndex - 1, {
          MIN: 0,
          MAX: navigationFlow.length - 1,
        }),
      }),
    goToMenu: () => () => ({ navigationIndex: -1 }),
    goToTip:
      (key: string) =>
      ({ navigationFlow }: HelpCenterState) => ({
        navigationIndex: navigationFlow.findIndex((v) => v === key),
      }),
    openToUnreadTip:
      (key: string) =>
      ({ navigationFlow, readTips }: HelpCenterState) =>
        !readTips[key]
          ? {
              isOpen: true,
              isOpeningToTip: true,
              navigationIndex: navigationFlow.findIndex((v) => v === key),
            }
          : {},
    toggle:
      () =>
      ({ isOpen }: HelpCenterState) => {
        void trackEvent('help_center_toggled', {
          status: isOpen ? 'closed' : 'open',
        });
        return { isOpen: !isOpen };
      },
    close:
      () =>
      ({ isOpen }: HelpCenterState) => {
        if (isOpen) {
          void trackEvent('help_center_toggled', {
            status: 'closed',
          });
        }
        return { isOpen: false };
      },
    hydrateReadTipsSuccess:
      (payload: Pick<HelpCenterState, 'readTips'>) =>
      (state: HelpCenterState) => ({
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

function useHelpCenterReducer() {
  const { additionalTips = {} } = useConfig();
  const [store, dispatch] = useReducer(reducer, getInitial(additionalTips));

  // Wrap all actions in dispatch
  const actions: HelpCenterActions<void> = useMemo(
    () => ({
      goToNext: () => dispatch(store.actions.goToNext()),
      goToPrev: () => dispatch(store.actions.goToPrev()),
      goToMenu: () => dispatch(store.actions.goToMenu()),
      goToTip: (payload: string) => dispatch(store.actions.goToTip(payload)),
      openToUnreadTip: (payload: string) =>
        dispatch(store.actions.openToUnreadTip(payload)),
      toggle: () => dispatch(store.actions.toggle()),
      close: () => dispatch(store.actions.close()),
      hydrateReadTipsSuccess: (payload: Pick<HelpCenterState, 'readTips'>) =>
        dispatch(store.actions.hydrateReadTipsSuccess(payload)),
      persistingReadTipsError: () =>
        dispatch(store.actions.persistingReadTipsError()),
    }),
    [store.actions]
  );

  return { state: store.state, actions };
}

export default useHelpCenterReducer;
