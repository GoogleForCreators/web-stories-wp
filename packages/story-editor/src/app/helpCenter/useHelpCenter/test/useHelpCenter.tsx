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
import { renderHook, act } from '@testing-library/preact';
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

  function Wrapper({ children }: PropsWithChildren<unknown>) {
    return (
      <APIContext.Provider value={apiContextValue}>
        <CurrentUserProvider>
          <HelpCenterProvider>{children}</HelpCenterProvider>
        </CurrentUserProvider>
      </APIContext.Provider>
    );
  }

  return renderHook(() => useHelpCenter(), { wrapper: Wrapper });
}

describe('useHelpCenter', () => {
  it('always returns the same actions by reference', async () => {
    const { result } = setup();
    const initialActionsReference = result.current.actions;
    await act(() => initialActionsReference.goToNext());
    expect(result.current.actions).toBe(initialActionsReference);
  });

  describe('goToNext', () => {
    it('doesnt increment out of navigation flow bounds', async () => {
      const { result } = setup();

      for (let i = 0; i < result.current.state.navigationFlow.length + 5; i++) {
        // eslint-disable-next-line no-await-in-loop -- Intentional.
        await act(() => result.current.actions.goToNext());
        const expected =
          i < result.current.state.navigationFlow.length
            ? i
            : result.current.state.navigationFlow.length - 1;
        expect(result.current.state.navigationIndex).toBe(expected);
      }
    });

    it('updates the read status of the tip', async () => {
      const { result } = setup();
      const expected: Record<string, boolean> = {};
      for (let i = 0; i < result.current.state.navigationFlow.length; i++) {
        // eslint-disable-next-line no-await-in-loop -- Intentional.
        await act(() => result.current.actions.goToNext());
        const expectedKey = result.current.state.navigationFlow[i];
        if (expectedKey !== DONE_TIP_ENTRY[0]) {
          expected[expectedKey] = true;
        }
        expect(result.current.state.readTips).toStrictEqual(expected);
      }
    });
  });

  describe('goToPrev', () => {
    it('doesnt decrement out of navigation flow bounds', async () => {
      const { result } = setup();
      // navigate to last tip in navigation flow
      for (let i = 0; i < result.current.state.navigationFlow.length; ++i) {
        // eslint-disable-next-line no-await-in-loop -- Intentional.
        await act(() => result.current.actions.goToNext());
      }

      // navigate way back past first tip
      for (let i = 0; i < result.current.state.navigationFlow.length + 5; i++) {
        const lastIndex = result.current.state.navigationFlow.length - 1;
        const currentIndex = lastIndex - i;
        const expected = currentIndex > 0 ? currentIndex : 0;
        expect(result.current.state.navigationIndex).toBe(expected);
        // eslint-disable-next-line no-await-in-loop -- Intentional.
        await act(() => result.current.actions.goToPrev());
      }
    });

    it('updates the read status of the tip', async () => {
      const { result } = setup();

      // go to the last tip
      const lastTipIndex = result.current.state.navigationFlow.length - 1;
      const lastTip = result.current.state.navigationFlow[lastTipIndex];
      await act(() => result.current.actions.goToTip(lastTip));

      // that tip should be read
      const expected = { [lastTip]: true };
      expect(result.current.state.readTips).toStrictEqual(expected);

      // go through the list backwards
      for (let i = lastTipIndex; i >= 0; i--) {
        const expectedKey = result.current.state.navigationFlow[i];
        expected[expectedKey] = true;
        expect(result.current.state.readTips).toStrictEqual(expected);
        // eslint-disable-next-line no-await-in-loop -- Intentional.
        await act(() => result.current.actions.goToPrev());
      }
    });
  });

  describe('goToMenu', () => {
    it('always sets the navigationIndex to -1', async () => {
      const { result } = setup();
      for (let i = 0; i < 3; i++) {
        // eslint-disable-next-line no-await-in-loop -- Intentional.
        await act(() => result.current.actions.goToNext());
      }

      await act(() => result.current.actions.goToMenu());
      expect(result.current.state.navigationIndex).toBe(-1);
    });
  });

  describe('goToTip', () => {
    it('sets navigationIndex to -1 (main menu) if key isnt in navigationFlow', async () => {
      const { result } = setup();
      // navigate away from main menu
      await act(() =>
        result.current.actions.goToTip(
          String(result.current.state.navigationFlow.length - 1)
        )
      );
      // navigate to unspecified key
      await act(() => result.current.actions.goToTip('this isnt a tip key'));
      expect(result.current.state.navigationIndex).toBe(-1);
    });

    it('sets navigationIndex to index of key in navigation flow', async () => {
      const { result } = setup();
      for (let i = 0; i < result.current.state.navigationFlow.length - 1; i++) {
        // eslint-disable-next-line no-await-in-loop -- Intentional.
        await act(() =>
          result.current.actions.goToTip(result.current.state.navigationFlow[i])
        );
        expect(result.current.state.navigationIndex).toBe(i);
      }
    });
  });

  describe('openToUnreadTip', () => {
    it('should only open the tip if it is not already read', async () => {
      const { result } = setup();
      await act(() => {
        result.current.actions.goToTip('cropSelectedElements');
        result.current.actions.goToMenu();
        result.current.actions.close();
      });

      expect(result.current.state.navigationIndex).toBe(-1);
      expect(result.current.state.isOpen).toBeFalse();

      await act(() =>
        result.current.actions.openToUnreadTip('cropSelectedElements')
      );
      expect(result.current.state.navigationIndex).toBe(-1);
      expect(result.current.state.isOpen).toBeFalse();

      await act(() =>
        result.current.actions.openToUnreadTip('addBackgroundMedia')
      );
      expect(result.current.state.navigationIndex).toBe(
        result.current.state.navigationFlow.findIndex(
          (v) => v === 'addBackgroundMedia'
        )
      );
      expect(result.current.state.isOpen).toBeTrue();
    });
  });
});
