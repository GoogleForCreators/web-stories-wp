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
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import APIContext from '../../../api/context';
import { CurrentUserProvider } from '../../../currentUser';
import { DONE_TIP_ENTRY } from '../../constants';
import useHelpCenter from '..';
import HelpCenterProvider from '../../provider';
import type { User } from '../../../../types';

function setup() {
  const currentUser: User = {
    id: 0,
    mediaOptimization: false,
    onboarding: {},
    trackingOptin: false,
  };
  const currentUserPromise = jest.fn(
    () => new Promise<User>((resolve) => resolve(currentUser))
  );
  const apiContextValue = {
    state: {
      currentUser,
    },
    actions: {
      updateCurrentUser: currentUserPromise,
      getCurrentUser: currentUserPromise,
    },
  };
  const wrapper = ({ children }: PropsWithChildren<undefined>) => (
    <APIContext.Provider value={apiContextValue}>
      <CurrentUserProvider>
        <HelpCenterProvider>{children}</HelpCenterProvider>
      </CurrentUserProvider>
    </APIContext.Provider>
  );

  return renderHook(() => useHelpCenter(), { wrapper });
}

describe('useHelpCenter', () => {
  it('always returns the same actions by reference', () => {
    const { result } = setup();
    const initialActionsReference = result.current.actions;
    act(() => initialActionsReference.goToNext());
    expect(result.current.actions).toBe(initialActionsReference);
  });

  describe('goToNext', () => {
    it('doesnt increment out of navigation flow bounds', () => {
      const { result } = setup();

      for (let i = 0; i < result.current.state.navigationFlow.length + 5; i++) {
        act(() => result.current.actions.goToNext());
        const expected =
          i < result.current.state.navigationFlow.length
            ? i
            : result.current.state.navigationFlow.length - 1;
        expect(result.current.state.navigationIndex).toBe(expected);
      }
    });

    it('updates the read status of the tip', () => {
      const { result } = setup();
      const expected: Record<string, boolean> = {};
      for (let i = 0; i < result.current.state.navigationFlow.length; i++) {
        act(() => result.current.actions.goToNext());
        const expectedKey = result.current.state.navigationFlow[i];
        if (expectedKey !== DONE_TIP_ENTRY[0]) {
          expected[expectedKey] = true;
        }
        expect(result.current.state.readTips).toStrictEqual(expected);
      }
    });
  });

  describe('goToPrev', () => {
    it('doesnt decrement out of navigation flow bounds', () => {
      const { result } = setup();
      // navigate to last tip in navigation flow
      for (let i = 0; i < result.current.state.navigationFlow.length; ++i) {
        act(() => result.current.actions.goToNext());
      }

      // navigate way back past first tip
      for (let i = 0; i < result.current.state.navigationFlow.length + 5; i++) {
        const lastIndex = result.current.state.navigationFlow.length - 1;
        const currentIndex = lastIndex - i;
        const expected = currentIndex > 0 ? currentIndex : 0;
        expect(result.current.state.navigationIndex).toBe(expected);
        act(() => result.current.actions.goToPrev());
      }
    });

    it('updates the read status of the tip', () => {
      const { result } = setup();

      // go to the last tip
      const lastTipIndex = result.current.state.navigationFlow.length - 1;
      const lastTip = result.current.state.navigationFlow[lastTipIndex];
      act(() => result.current.actions.goToTip(lastTip));

      // that tip should be read
      const expected = { [lastTip]: true };
      expect(result.current.state.readTips).toStrictEqual(expected);

      // go through the list backwards
      for (let i = lastTipIndex; i >= 0; i--) {
        const expectedKey = result.current.state.navigationFlow[i];
        expected[expectedKey] = true;
        expect(result.current.state.readTips).toStrictEqual(expected);
        act(() => result.current.actions.goToPrev());
      }
    });
  });

  describe('goToMenu', () => {
    it('always sets the navigationIndex to -1', () => {
      const { result } = setup();
      for (let i = 0; i < 3; i++) {
        act(() => result.current.actions.goToNext());
      }
      act(() => result.current.actions.goToMenu());
      expect(result.current.state.navigationIndex).toBe(-1);
    });
  });

  describe('goToTip', () => {
    it('sets navigationIndex to -1 (main menu) if key isnt in navigationFlow', () => {
      const { result } = setup();
      // navigate away from main menu
      act(() =>
        result.current.actions.goToTip(
          String(result.current.state.navigationFlow.length - 1)
        )
      );
      // navigate to unspecified key
      act(() => result.current.actions.goToTip('this isnt a tip key'));
      expect(result.current.state.navigationIndex).toBe(-1);
    });

    it('sets navigationIndex to index of key in navigation flow', () => {
      const { result } = setup();
      for (let i = 0; i < result.current.state.navigationFlow.length - 1; i++) {
        act(() =>
          result.current.actions.goToTip(result.current.state.navigationFlow[i])
        );
        expect(result.current.state.navigationIndex).toBe(i);
      }
    });
  });

  describe('openToUnreadTip', () => {
    it('should only open the tip if it is not already read', () => {
      const { result } = setup();
      act(() => {
        result.current.actions.goToTip('cropSelectedElements');
        result.current.actions.goToMenu();
        result.current.actions.close();
      });

      expect(result.current.state.navigationIndex).toBe(-1);
      expect(result.current.state.isOpen).toBeFalse();

      act(() => result.current.actions.openToUnreadTip('cropSelectedElements'));
      expect(result.current.state.navigationIndex).toBe(-1);
      expect(result.current.state.isOpen).toBeFalse();

      act(() => result.current.actions.openToUnreadTip('addBackgroundMedia'));
      expect(result.current.state.navigationIndex).toBe(
        result.current.state.navigationFlow.findIndex(
          (v) => v === 'addBackgroundMedia'
        )
      );
      expect(result.current.state.isOpen).toBeTrue();
    });
  });
});
