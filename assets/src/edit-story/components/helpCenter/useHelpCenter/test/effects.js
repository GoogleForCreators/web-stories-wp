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
import { createDynamicNavigationFlow } from '../effects';
import { TIPS, BASE_NAVIGATION_FLOW, DONE_TIP_ENTRY } from '../../constants';
import { initial, deriveState } from '../';

const mockState = (overrides) => ({
  ...initial.state,
  ...overrides,
});

// @TODO Split deriveState up into more atomic effect unit tests
// @TODO describe('composeEffects');
// @TODO describe('resetNavigationIndexOnOpen');
// @TODO describe('deriveBottomNavigation');
// @TODO describe('deriveTransitionDirection');
// @TODO describe('deriveDisabledButtons');
// @TODO describe('deriveReadTip');
// @TODO describe('deriveUnreadTipsCount');

describe('createDynamicNavigationFlow', () => {
  it('should do nothing if not navigating from the main menu', () => {
    // case where we stay on menu
    const onMenuState = mockState({ navigationIndex: -1 });
    expect(createDynamicNavigationFlow(onMenuState, onMenuState)).toStrictEqual(
      {}
    );
    // case where we navigate to menu
    const onTipState = mockState({ navigationIndex: 0 });
    expect(createDynamicNavigationFlow(onTipState, onMenuState)).toStrictEqual(
      {}
    );
    // case where we navigate between tips
    const onAnotherTipState = mockState({ navigationIndex: 1 });
    expect(
      createDynamicNavigationFlow(onTipState, onAnotherTipState)
    ).toStrictEqual({});
  });

  it('on navigate from menu, should append unread tips before navigation index to the end of the navigation flow before done tip', () => {
    const onMenuState = mockState({ navigationIndex: -1 });
    Object.keys(TIPS).forEach((tip) => {
      const tipIndex = BASE_NAVIGATION_FLOW.findIndex((v) => v === tip);
      const tipsBeforeCurrent = BASE_NAVIGATION_FLOW.slice(0, tipIndex);
      expect(
        createDynamicNavigationFlow(
          onMenuState,
          mockState({ navigationIndex: tipIndex })
        )
      ).toStrictEqual({
        navigationFlow: [
          ...BASE_NAVIGATION_FLOW,
          ...tipsBeforeCurrent,
          DONE_TIP_ENTRY[0],
        ],
      });
    });
  });
});

describe('deriveState', () => {
  it('sets isPrevDisabled to true if navigationIndex becomes 0', () => {
    const previousState = mockState({ navigationIndex: 5 });
    const nextState = mockState({ navigationIndex: 0 });
    const { isPrevDisabled } = deriveState(previousState, nextState);
    expect(isPrevDisabled).toBe(true);
  });

  it('sets isPrevDisabled to false if navigationIndex is greater than 0', () => {
    const previousState = mockState({ navigationIndex: 0 });
    const nextState = mockState({ navigationIndex: 5 });
    const { isPrevDisabled } = deriveState(previousState, nextState);
    expect(isPrevDisabled).toBe(false);
  });

  it('sets isNextDisabled to true if navigationIndex is on last index in navigation flow', () => {
    const previousState = mockState({
      navigationIndex: 0,
      navigationFlow: ['tip_1', 'tip_2'],
    });
    const nextState = mockState({
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2'],
    });
    const { isNextDisabled } = deriveState(previousState, nextState);
    expect(isNextDisabled).toBe(true);
  });

  it('sets isNextDisabled to false if navigationIndex is not on last index in navigation flow', () => {
    const previousState = mockState({
      navigationIndex: 2,
      navigationFlow: ['tip_1', 'tip_2', 'tip_3'],
    });
    const nextState = mockState({
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2', 'tip_3'],
    });
    const { isNextDisabled } = deriveState(previousState, nextState);
    expect(isNextDisabled).toBe(false);
  });

  it('sets isLeftToRightTransition to true if navigationIndex is increasing', () => {
    const previousState = mockState({
      navigationIndex: 0,
      navigationFlow: ['tip_1', 'tip_2'],
    });
    const nextState = mockState({
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2'],
    });
    const { isLeftToRightTransition } = deriveState(previousState, nextState);
    expect(isLeftToRightTransition).toBe(true);
  });

  it('sets isLeftToRightTransition to false if navigationIndex is decreasing', () => {
    const previousState = mockState({
      navigationIndex: 2,
      navigationFlow: ['tip_1', 'tip_2'],
    });
    const nextState = mockState({
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2'],
    });
    const { isLeftToRightTransition } = deriveState(previousState, nextState);
    expect(isLeftToRightTransition).toBe(false);
  });

  it('sets hasBottomNavigation to true if navigationIndex is not on menu index', () => {
    const previousState = mockState({
      navigationIndex: -1,
    });
    const nextState = mockState({
      navigationIndex: 0,
    });
    const { hasBottomNavigation } = deriveState(previousState, nextState);
    expect(hasBottomNavigation).toBe(true);
  });

  it('sets hasBottomNavigation to false if navigationIndex is on menu index', () => {
    const previousState = mockState({
      navigationIndex: 4,
    });
    const nextState = mockState({
      navigationIndex: -1,
    });
    const { hasBottomNavigation } = deriveState(previousState, nextState);
    expect(hasBottomNavigation).toBe(false);
  });

  it('sets a tip to read if the navigation index is not on the menu or done index', () => {
    const navigationFlow = Object.keys(TIPS);
    const previousState = mockState({
      navigationIndex: -1,
      navigationFlow: navigationFlow,
    });
    const nextState = mockState({
      navigationIndex: 0,
      navigationFlow: navigationFlow,
    });
    const { readTips } = deriveState(previousState, nextState);
    expect(readTips[navigationFlow[0]]).toBe(true);
  });

  it('resets the navigation index to the main menu when opening', () => {
    const previousState = mockState({
      isOpen: false,
      navigationIndex: 4,
    });
    const nextState = mockState({
      isOpen: true,
      navigationIndex: 4,
    });
    const { navigationIndex } = deriveState(previousState, nextState);
    expect(navigationIndex).toBe(-1);
  });

  it('retains navigation index when staying open between state transitions', () => {
    const previousState = mockState({
      isOpen: true,
      navigationIndex: 4,
    });
    const nextState = mockState({
      isOpen: true,
      navigationIndex: 4,
    });
    const { navigationIndex } = deriveState(previousState, nextState);
    expect(navigationIndex).toBe(4);
  });
});
