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
import { TIPS } from '../constants';

const TIP_KEYS_MAP = Object.keys(TIPS).reduce((keyMap, key) => {
  keyMap[key] = true;
  return keyMap;
}, {});

const isMenuIndex = (previous, next) => next.navigationIndex < 0;
const navigationFlowTips = (previous, next) =>
  next.navigationFlow.filter((key) => TIP_KEYS_MAP[key]);

export const resetNavigationIndexOnOpen = (previous, next) => ({
  navigationIndex: !previous.isOpen && next.isOpen ? -1 : next.navigationIndex,
});

export const deriveBottomNavigation = (previous, next) => ({
  hasBottomNavigation: !isMenuIndex(previous, next),
});

export const deriveTransitionDirection = (previous, next) => ({
  isLeftToRightTransition:
    !isMenuIndex(previous, next) &&
    next.navigationIndex - previous.navigationIndex > 0,
});

export const deriveDisabledButtons = (previous, next) => ({
  isPrevDisabled: next.navigationIndex <= 0,
  isNextDisabled: next.navigationIndex >= next.navigationFlow?.length - 1,
});

export const deriveReadTip = (previous, next) => {
  const readTipKey =
    !isMenuIndex(next) && navigationFlowTips(next)?.[next.navigationIndex];

  const readTips = readTipKey
    ? {
        ...next.readTips,
        [readTipKey]: true,
      }
    : next.readTips;

  return { readTips };
};

/**
 * Takes an array of effects and returns a composed function
 * that given next and previous state runs through each effect
 * and computes the resulting state.
 *
 * @param {Array<Function>} effects arry of effects
 * @return {Function} (previous, next) => <object in shape of next>
 */
export const createEffectRun = (effects = []) => (previous, next) =>
  effects.reduce(
    (effectedNext, effect) => ({
      ...next,
      ...effectedNext,
      ...effect(previous, effectedNext),
    }),
    next
  );
