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
import { renderHook, act } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { useUserOnboarding } from '../..';
import { KEYS } from '../../../components/helpCenter/constants';
import { useHelpCenter } from '../../helpCenter';
jest.mock('../../helpCenter');

describe('useUserOnboarding', () => {
  jest.useFakeTimers();
  beforeEach(jest.clearAllMocks);

  it('should open the help center to the Safe Zone tip if it is triggered', async () => {
    const openToUnreadTip = jest.fn();
    useHelpCenter.mockImplementationOnce(() => ({ openToUnreadTip }));

    const { result: trigger } = renderHook(() =>
      useUserOnboarding(({ SAFE_ZONE }) => SAFE_ZONE)
    );

    await act(async () => {
      await trigger.current();
    });

    jest.runOnlyPendingTimers();
    expect(openToUnreadTip).toHaveBeenCalledWith(KEYS.SAFE_ZONE);
  });
});
