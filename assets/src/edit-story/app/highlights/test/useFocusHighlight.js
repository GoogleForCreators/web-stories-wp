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
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { useState } from 'react';
import useFocusHighlight from '../useFocusHighlight';
import HighlightContext from '../context';

// Only mock useFocusOut().
// https://jestjs.io/docs/jest-object#jestrequireactualmodulename
jest.mock('@web-stories-wp/design-system', () => {
  const original = jest.requireActual('@web-stories-wp/design-system');
  return {
    __esModule: true,
    ...original,
    useFocusOut: jest.fn(),
  };
});

// eslint-disable-next-line import/order
import { useFocusOut } from '@web-stories-wp/design-system';

describe('useFocusHighlight()', () => {
  const key = 'statekey';
  let cancelEffect;
  let onFocusOut;
  let wrapper;

  beforeEach(() => {
    cancelEffect = jest.fn();
    onFocusOut = jest.fn();

    const contextValue = {
      cancelEffect,
      onFocusOut,
      [key]: { focus: true, showEffect: true },
    };
    const provider = ({ children }) => (
      <HighlightContext.Provider value={contextValue}>
        {children}
      </HighlightContext.Provider>
    );
    wrapper = provider;
  });

  it('should deal with focus-in/focus-out for the provided ref', () => {
    const mockFocus = jest.fn();
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();
    const mockElement = {
      focus: mockFocus,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    };

    const { result } = renderHook(() => useFocusHighlight(key, mockElement), {
      wrapper,
    });
    expect(result.current.focus).toBe(true);
    expect(useFocusOut).toHaveBeenCalledWith(
      expect.objectContaining({ current: mockElement }),
      onFocusOut,
      expect.arrayContaining([mockElement])
    );

    // the event listeners should only be added when the effect is shown
    expect(mockAddEventListener.mock.calls[0][0]).toStrictEqual('click');
    expect(mockAddEventListener.mock.calls[1][0]).toStrictEqual('keydown');
    expect(mockRemoveEventListener).not.toHaveBeenCalled();
    expect(mockFocus).toHaveBeenCalledWith();
  });

  it('should cancel the effect when the element is manipulated', () => {
    const HighlightableInput = () => {
      const [mockElement, setMockElement] = useState(null);
      useFocusHighlight(key, mockElement);
      return <input data-testid="focusable-input" ref={setMockElement} />;
    };

    render(<HighlightableInput />, { wrapper });

    const input = screen.getByTestId('focusable-input');
    fireEvent.click(input);

    expect(cancelEffect).toHaveBeenCalledWith(key);
  });

  it('should not re-focus when tabbing out', () => {
    const HighlightableInput = () => {
      const [mockElement, setMockElement] = useState(null);
      useFocusHighlight(key, mockElement);
      return <input data-testid="focusable-input" ref={setMockElement} />;
    };

    render(<HighlightableInput />, { wrapper });

    const input = screen.getByTestId('focusable-input');
    input.focus();
    expect(input).toHaveFocus();

    userEvent.tab();
    expect(cancelEffect).toHaveBeenCalledWith(key);
    expect(input).not.toHaveFocus();
  });
});
