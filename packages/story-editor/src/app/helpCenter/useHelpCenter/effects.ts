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
 * Internal dependencies
 */
import type { HelpCenterState } from '../types';
import { DONE_TIP_ENTRY } from '../constants';

declare const WEB_STORIES_DISABLE_QUICK_TIPS: 'true' | 'false' | undefined;

const isMenuIndex = (_previous: HelpCenterState, next: HelpCenterState) =>
  next.navigationIndex < 0;

const isComingFromMenu = (previous: HelpCenterState, next: HelpCenterState) =>
  previous.navigationIndex < 0 && next.navigationIndex >= 0;

const navigationFlowTips = (
  _previous: HelpCenterState,
  next: HelpCenterState
) => {
  return (next.navigationFlow || []).filter((key) =>
    next.tipKeys.includes(key)
  );
};

const isInitialHydrate = (previous: HelpCenterState, next: HelpCenterState) =>
  !previous.isHydrated && next.isHydrated;

export const resetNavigationIndexOnOpen = (
  previous: HelpCenterState,
  next: HelpCenterState
) => {
  const isOpening = !previous.isOpen && next.isOpen;
  const isOpeningToTip = !previous.isOpeningToTip && next.isOpeningToTip;
  const result = {
    navigationIndex: isOpening && !isOpeningToTip ? -1 : next.navigationIndex,
  };

  return result;
};

export const deriveBottomNavigation = (
  previous: HelpCenterState,
  next: HelpCenterState
) => ({
  hasBottomNavigation: !isMenuIndex(previous, next),
});

export const deriveTransitionDirection = (
  previous: HelpCenterState,
  next: HelpCenterState
) => ({
  isLeftToRightTransition:
    !isMenuIndex(previous, next) &&
    next.navigationIndex - previous.navigationIndex > 0,
});

export const deriveDisabledButtons = (
  _previous: HelpCenterState,
  next: HelpCenterState
) => ({
  isPrevDisabled: next.navigationIndex <= 0,
  isNextDisabled: next.navigationIndex >= next.navigationFlow?.length - 1,
});

export const deriveReadTip = (
  previous: HelpCenterState,
  next: HelpCenterState
) => {
  const readTipKey =
    !isMenuIndex(previous, next) &&
    navigationFlowTips(previous, next)?.[next.navigationIndex];

  const readTips = readTipKey
    ? {
        ...next.readTips,
        [readTipKey]: true,
      }
    : next.readTips;

  return { readTips };
};

export const createDynamicNavigationFlow = (
  previous: HelpCenterState,
  next: HelpCenterState
) => {
  if (!isComingFromMenu(previous, next)) {
    return {};
  }
  const appendedTips = next.tipKeys
    // Tips before current index
    .slice(0, next.navigationIndex)
    // Filter out read tips
    .filter((tip) => !next.readTips[tip]);
  return {
    navigationFlow: [...next.tipKeys, ...appendedTips, DONE_TIP_ENTRY[0]],
  };
};

export function deriveUnreadTipsCount(
  _previous: HelpCenterState,
  next: HelpCenterState
) {
  return {
    unreadTipsCount:
      next.tipKeys.filter((tip) => !next.readTips[tip])?.length || 0,
  };
}

export function deriveAutoOpen(
  previous: HelpCenterState,
  next: HelpCenterState
) {
  if (
    typeof WEB_STORIES_DISABLE_QUICK_TIPS !== 'undefined' &&
    WEB_STORIES_DISABLE_QUICK_TIPS === 'true'
  ) {
    return {};
  }
  if (isInitialHydrate(previous, next)) {
    const hasNewTips = previous.unreadTipsCount < next.unreadTipsCount;
    return hasNewTips ? { isOpen: true } : {};
  }
  return {};
}

// If there are any unread tips, we respect users last open setting.
// If all tips are read, we want the popup closed regardless of user setting.
export function deriveInitialOpen(persisted: Partial<HelpCenterState>) {
  if (
    typeof WEB_STORIES_DISABLE_QUICK_TIPS !== 'undefined' &&
    WEB_STORIES_DISABLE_QUICK_TIPS === 'true'
  ) {
    return {};
  }
  const hasUnreadTips = Boolean(persisted?.unreadTipsCount);
  return hasUnreadTips && persisted?.isOpen !== undefined
    ? {
        isOpen: persisted?.isOpen,
      }
    : {};
}

export function deriveInitialUnreadTipsCount(
  persisted: Partial<HelpCenterState>
) {
  return persisted?.unreadTipsCount
    ? {
        unreadTipsCount: persisted?.unreadTipsCount,
      }
    : {};
}

export function resetIsOpeningToTip(
  previous: HelpCenterState,
  next: HelpCenterState
) {
  return {
    isOpeningToTip: next.isOpeningToTip && !previous.isOpeningToTip,
  };
}

type StateEffect<P, N> = (previous: P, next: N) => Partial<N>;

/**
 * Takes an array of effects and returns a composed function
 * that given next and previous state runs through each effect
 * and computes the resulting state.
 *
 * @param effects array of effects
 * @return (previous, next) => <object in shape of next>
 */
export function composeEffects<P, N>(effects: StateEffect<P, N>[]) {
  return (previous: P, next: N): N =>
    effects.reduce(
      (effectedNext, effect) => ({
        ...next,
        ...effectedNext,
        ...effect(previous, effectedNext),
      }),
      next
    );
}
