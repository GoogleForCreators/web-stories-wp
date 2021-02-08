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
import { renderHook, act } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import { useHelpCenter, deriveState } from '../useHelpCenter';

describe('deriveState', () => {
  it('sets isPrevDisabled to true if navigationIndex becomes 0', () => {
    const previousState = { navigationIndex: 5 };
    const nextState = { navigationIndex: 0 };
    const { isPrevDisabled } = deriveState(previousState, nextState);
    expect(isPrevDisabled).toBe(true);
  });

  it('sets isPrevDisabled to false if navigationIndex is greater than 0', () => {
    const previousState = { navigationIndex: 0 };
    const nextState = { navigationIndex: 5 };
    const { isPrevDisabled } = deriveState(previousState, nextState);
    expect(isPrevDisabled).toBe(false);
  });

  it('sets isNextDisabled to true if navigationIndex is on last index in navigation flow', () => {
    const previousState = {
      navigationIndex: 0,
      navigationFlow: ['tip_1', 'tip_2'],
    };
    const nextState = {
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2'],
    };
    const { isNextDisabled } = deriveState(previousState, nextState);
    expect(isNextDisabled).toBe(true);
  });

  it('sets isNextDisabled to false if navigationIndex is not on last index in navigation flow', () => {
    const previousState = {
      navigationIndex: 2,
      navigationFlow: ['tip_1', 'tip_2', 'tip_3'],
    };
    const nextState = {
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2', 'tip_3'],
    };
    const { isNextDisabled } = deriveState(previousState, nextState);
    expect(isNextDisabled).toBe(false);
  });

  it('sets isLeftToRightTransition to true if navigationIndex is increasing', () => {
    const previousState = {
      navigationIndex: 0,
      navigationFlow: ['tip_1', 'tip_2'],
    };
    const nextState = {
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2'],
    };
    const { isLeftToRightTransition } = deriveState(previousState, nextState);
    expect(isLeftToRightTransition).toBe(true);
  });

  it('sets isLeftToRightTransition to false if navigationIndex is decreasing', () => {
    const previousState = {
      navigationIndex: 2,
      navigationFlow: ['tip_1', 'tip_2'],
    };
    const nextState = {
      navigationIndex: 1,
      navigationFlow: ['tip_1', 'tip_2'],
    };
    const { isLeftToRightTransition } = deriveState(previousState, nextState);
    expect(isLeftToRightTransition).toBe(false);
  });

  it('sets hasBottomNavigation to true if navigationIndex is not on menu index', () => {
    const previousState = {
      navigationIndex: -1,
    };
    const nextState = {
      navigationIndex: 0,
    };
    const { hasBottomNavigation } = deriveState(previousState, nextState);
    expect(hasBottomNavigation).toBe(true);
  });

  it('sets hasBottomNavigation to false if navigationIndex is on menu index', () => {
    const previousState = {
      navigationIndex: 4,
    };
    const nextState = {
      navigationIndex: -1,
    };
    const { hasBottomNavigation } = deriveState(previousState, nextState);
    expect(hasBottomNavigation).toBe(false);
  });
});

describe('useHelpCenter', () => {
  it('always returns the same actions by reference', () => {
    const { result } = renderHook(() => useHelpCenter());
    const initialActionsReference = result.current.actions;

    Object.values(initialActionsReference).forEach((action) => {
      act(action);
      expect(result.current.actions).toBe(initialActionsReference);
    });
  });

  describe('goToNext', () => {
    it('doesnt increment out of navigation flow bounds', () => {
      const { result } = renderHook(() => useHelpCenter());
      for (let i = 0; i < result.current.state.navigationFlow.length + 5; i++) {
        act(() => {
          result.current.actions.goToNext();
        });
        const expected =
          i < result.current.state.navigationFlow.length
            ? i
            : result.current.state.navigationFlow.length - 1;
        expect(result.current.state.navigationIndex).toBe(expected);
      }
    });
  });

  describe('goToPrev', () => {
    it('doesnt decrement out of navigation flow bounds', () => {
      const { result } = renderHook(() => useHelpCenter());
      // navigate to last tip in navigation flow
      for (let i = 0; i < result.current.state.navigationFlow.length; ++i) {
        act(() => {
          result.current.actions.goToNext();
        });
      }

      // navigate way back past first tip
      for (let i = 0; i < result.current.state.navigationFlow.length + 5; i++) {
        const lastIndex = result.current.state.navigationFlow.length - 1;
        const currentIndex = lastIndex - i;
        const expected = currentIndex > 0 ? currentIndex : 0;
        expect(result.current.state.navigationIndex).toBe(expected);
        act(() => {
          result.current.actions.goToPrev();
        });
      }
    });
  });

  describe('goToMenu', () => {
    it('always sets the navigationIndex to -1', () => {
      const { result } = renderHook(() => useHelpCenter());
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.actions.goToNext();
        });
      }
      act(() => {
        result.current.actions.goToMenu();
      });
      expect(result.current.state.navigationIndex).toBe(-1);
    });
  });

  describe('goToTip', () => {
    it('sets navigationIndex to -1 (main menu) if key isnt in navigationFlow', () => {
      const { result } = renderHook(() => useHelpCenter());
      // navigate away from main menu
      act(() => {
        result.current.actions.goToTip(
          result.current.state.navigationFlow.length - 1
        );
      });
      // navigate to unspecified key
      act(() => {
        result.current.actions.goToTip('this isnt a tip key');
      });
      expect(result.current.state.navigationIndex).toBe(-1);
    });

    it('sets navigationIndex to index of key in navigation flow', () => {
      const { result } = renderHook(() => useHelpCenter());
      for (let i = 0; i < result.current.state.navigationFlow.length - 1; i++) {
        act(() => {
          result.current.actions.goToTip(
            result.current.state.navigationFlow[i]
          );
        });
        expect(result.current.state.navigationIndex).toBe(i);
      }
    });
  });
});
