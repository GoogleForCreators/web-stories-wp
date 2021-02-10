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
import { renderHook } from '@testing-library/react-hooks';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { useRef } from 'react';
import useFocusHighlight from '../useFocusHighlight';
import { useContextSelector, useFocusOut } from '../../../../design-system';

jest.mock('../../../../design-system/utils/useContextSelector');
jest.mock('../../../../design-system/utils/useFocusOut');

describe('useFocusHighlight()', () => {
  jest.useFakeTimers();
  beforeEach(jest.clearAllMocks);

  it('should deal with focus-in/focus-out for the provided ref', () => {
    const key = 'statekey';
    const cancelEffect = jest.fn();
    const onFocusOut = jest.fn();

    useContextSelector.mockImplementationOnce(() => ({
      cancelEffect,
      onFocusOut,
      [key]: { focus: true, showEffect: true },
    }));

    const mockFocus = jest.fn();
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();
    const mockRef = {
      current: {
        focus: mockFocus,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      },
    };
    const { result } = renderHook(() => useFocusHighlight(key, mockRef));
    expect(result.current.focus).toBe(true);
    expect(useFocusOut).toHaveBeenCalledWith(mockRef, onFocusOut);

    // the event listeners should only be added when the effect is shown
    expect(mockAddEventListener.mock.calls[0][0]).toStrictEqual('click');
    expect(mockAddEventListener.mock.calls[1][0]).toStrictEqual('keydown');
    expect(mockRemoveEventListener).not.toHaveBeenCalled();
    expect(mockFocus).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(mockFocus).toHaveBeenCalledWith();
  });

  it('should cancel the effect when the element is manipulated', () => {
    const key = 'statekey';
    const cancelEffect = jest.fn();

    useContextSelector.mockImplementationOnce(() => ({
      cancelEffect,
      [key]: { focus: true, showEffect: true },
    }));

    const Wrapper = () => {
      const mockRef = useRef();
      useFocusHighlight(key, mockRef);
      return <input data-testid="focusable-input" ref={mockRef} />;
    };

    const { getByTestId } = render(<Wrapper />);
    const input = getByTestId('focusable-input');
    fireEvent.click(input);
    expect(cancelEffect).toHaveBeenCalledWith(key);
  });

  it('should not re-focus when tabbing out', () => {
    const key = 'statekey';
    const cancelEffect = jest.fn();

    useContextSelector.mockImplementationOnce(() => ({
      cancelEffect,
      [key]: { focus: true, showEffect: true },
    }));

    const Wrapper = () => {
      const mockRef = useRef();
      useFocusHighlight(key, mockRef);
      return <input data-testid="focusable-input" ref={mockRef} />;
    };

    const { getByTestId } = render(<Wrapper />);

    getByTestId('focusable-input').focus();
    expect(getByTestId('focusable-input')).toHaveFocus();
    userEvent.tab();
    expect(cancelEffect).toHaveBeenCalledWith(key);
    expect(getByTestId('focusable-input')).not.toHaveFocus();
  });
});
