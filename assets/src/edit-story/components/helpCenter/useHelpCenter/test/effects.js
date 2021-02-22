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
import { initial } from '../';
import {
  BASE_NAVIGATION_FLOW,
  DONE_TIP_ENTRY,
  TIPS,
  TIP_KEYS_MAP,
} from '../../constants';
import {
  composeEffects,
  createDynamicNavigationFlow,
  deriveBottomNavigation,
  deriveDisabledButtons,
  deriveReadTip,
  deriveTransitionDirection,
  deriveUnreadTipsCount,
  resetNavigationIndexOnOpen,
} from '../effects';

const mockState = (overrides = {}) => ({
  ...initial.state,
  ...overrides,
});

describe('composeEffects', () => {
  it('retains all properties from next state', () => {
    const emptyEffect = () => ({});
    const nonEmptyEffect = () => ({ someDerivedState: true });
    const overwritingEffect = () => ({ prop3: 'someOtherString' });

    const effects = composeEffects([
      emptyEffect,
      nonEmptyEffect,
      overwritingEffect,
    ]);

    const previous = {};
    const next = {
      prop1: true,
      prop2: {},
      prop3: 'someString',
    };

    const effectedState = effects(previous, next);

    const effectedStateKeys = Object.keys(effectedState);
    const nextKeys = Object.keys(next);

    expect(nextKeys.every((key) => effectedStateKeys.includes(key))).toBe(true);
  });

  it('calls all effects sequentially', () => {
    const previous = {};
    const next = {};

    const mockEffects = Array.from({ length: 10 }, () => jest.fn());
    const effects = composeEffects(mockEffects);

    effects(previous, next);

    mockEffects.forEach((mockEffect, i) => {
      expect(mockEffect).toHaveBeenCalledWith(previous, next);
      mockEffects.slice(0, i).forEach((effect) => {
        expect(mockEffect).toHaveBeenCalledAfter(effect);
      });
    });
  });
});

describe('deriveUnreadTipsCount', () => {
  it('effects proper state partial', () => {
    const statePartial = deriveUnreadTipsCount(mockState(), mockState());
    expect(Object.keys(statePartial)).toStrictEqual(['unreadTipsCount']);
  });

  it('counts 0 if all tips read', () => {
    const { unreadTipsCount } = deriveUnreadTipsCount(
      mockState(),
      mockState({
        readTips: TIP_KEYS_MAP,
      })
    );
    expect(unreadTipsCount).toBe(0);
  });

  it('ignores non-tip keys', () => {
    const { unreadTipsCount } = deriveUnreadTipsCount(
      mockState(),
      mockState({
        readTips: {
          notATip: true,
        },
      })
    );
    expect(unreadTipsCount).toBe(Object.keys(TIP_KEYS_MAP).length);
  });

  it('counts length of unread tip keys', () => {
    const readTips = {
      [BASE_NAVIGATION_FLOW[0]]: true,
      [BASE_NAVIGATION_FLOW[1]]: true,
      [BASE_NAVIGATION_FLOW[2]]: true,
    };
    const { unreadTipsCount } = deriveUnreadTipsCount(
      mockState(),
      mockState({
        readTips,
      })
    );
    expect(unreadTipsCount).toBe(
      Object.keys(TIP_KEYS_MAP).length - Object.keys(readTips).length
    );
  });
});

describe('resetNavigationIndexOnOpen', () => {
  it('effects proper state partial', () => {
    const statePartial = resetNavigationIndexOnOpen(mockState(), mockState());
    expect(Object.keys(statePartial)).toStrictEqual(['navigationIndex']);
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
    const { navigationIndex } = resetNavigationIndexOnOpen(
      previousState,
      nextState
    );
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
    const { navigationIndex } = resetNavigationIndexOnOpen(
      previousState,
      nextState
    );
    expect(navigationIndex).toBe(4);
  });
});

describe('deriveBottomNavigation', () => {
  it('effects proper state partial', () => {
    const statePartial = deriveBottomNavigation(mockState(), mockState());
    expect(Object.keys(statePartial)).toStrictEqual(['hasBottomNavigation']);
  });

  it('sets hasBottomNavigation to true if navigationIndex is not on menu index', () => {
    const previousState = mockState({
      navigationIndex: -1,
    });
    const nextState = mockState({
      navigationIndex: 0,
    });
    const { hasBottomNavigation } = deriveBottomNavigation(
      previousState,
      nextState
    );
    expect(hasBottomNavigation).toBe(true);
  });

  it('sets hasBottomNavigation to false if navigationIndex is on menu index', () => {
    const previousState = mockState({
      navigationIndex: 4,
    });
    const nextState = mockState({
      navigationIndex: -1,
    });
    const { hasBottomNavigation } = deriveBottomNavigation(
      previousState,
      nextState
    );
    expect(hasBottomNavigation).toBe(false);
  });
});

describe('deriveTransitionDirection', () => {
  it('effects proper state partial', () => {
    const statePartial = deriveTransitionDirection(mockState(), mockState());
    expect(Object.keys(statePartial)).toStrictEqual([
      'isLeftToRightTransition',
    ]);
  });

  it('sets isLeftToRightTransition to true if navigationIndex is increasing', () => {
    const previousState = mockState({
      navigationIndex: 0,
    });
    const nextState = mockState({
      navigationIndex: 1,
    });
    const { isLeftToRightTransition } = deriveTransitionDirection(
      previousState,
      nextState
    );
    expect(isLeftToRightTransition).toBe(true);
  });

  it('sets isLeftToRightTransition to false if navigationIndex is decreasing', () => {
    const previousState = mockState({
      navigationIndex: 2,
    });
    const nextState = mockState({
      navigationIndex: 1,
    });
    const { isLeftToRightTransition } = deriveTransitionDirection(
      previousState,
      nextState
    );
    expect(isLeftToRightTransition).toBe(false);
  });
});

describe('deriveDisabledButtons', () => {
  it('effects proper state partial', () => {
    const statePartial = deriveDisabledButtons(mockState(), mockState());
    expect(Object.keys(statePartial)).toStrictEqual([
      'isPrevDisabled',
      'isNextDisabled',
    ]);
  });

  it('sets isPrevDisabled to true if navigationIndex becomes 0', () => {
    const previousState = mockState({ navigationIndex: 5 });
    const nextState = mockState({ navigationIndex: 0 });
    const { isPrevDisabled } = deriveDisabledButtons(previousState, nextState);
    expect(isPrevDisabled).toBe(true);
  });

  it('sets isPrevDisabled to false if navigationIndex is greater than 0', () => {
    const previousState = mockState({ navigationIndex: 0 });
    const nextState = mockState({ navigationIndex: 5 });
    const { isPrevDisabled } = deriveDisabledButtons(previousState, nextState);
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
    const { isNextDisabled } = deriveDisabledButtons(previousState, nextState);
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
    const { isNextDisabled } = deriveDisabledButtons(previousState, nextState);
    expect(isNextDisabled).toBe(false);
  });
});

describe('deriveReadTip', () => {
  it('effects proper state partial', () => {
    const statePartial = deriveReadTip(mockState(), mockState());
    expect(Object.keys(statePartial)).toStrictEqual(['readTips']);
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
    const { readTips } = deriveReadTip(previousState, nextState);
    expect(readTips[navigationFlow[0]]).toBe(true);
  });
});

describe('createDynamicNavigationFlow', () => {
  it('effects proper state partial', () => {
    // doesn't alter any properties if not coming from menu
    let statePartial = createDynamicNavigationFlow(mockState(), mockState());
    expect(Object.keys(statePartial)).toStrictEqual([]);

    // alters navigationFlow if coming from menu
    statePartial = createDynamicNavigationFlow(
      mockState({
        navigationIndex: -1,
      }),
      mockState({
        navigationIndex: 2,
      })
    );
    expect(Object.keys(statePartial)).toStrictEqual(['navigationFlow']);
  });

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
