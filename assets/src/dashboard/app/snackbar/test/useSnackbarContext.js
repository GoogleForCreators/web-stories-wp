/*
 * Copyright 2020 Google LLC
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
import SnackbarProvider from '../snackbarProvider';
import useSnackbarContext from '../useSnackbarContext';

const MESSAGE_1 = {
  message: 'one',
  id: 1,
};

const MESSAGE_2 = {
  message: 'two',
  id: 2,
};

describe('useSnackbarContext', () => {
  it('should throw an error if used outside of <SnackbarProvider />', () => {
    expect(() => {
      const {
        // eslint-disable-next-line no-unused-vars
        result: { current },
      } = renderHook(() => useSnackbarContext());
    }).toThrow(
      Error('useSnackbarContext() must be used within a <SnackbarProvider />')
    );
  });

  it('should not throw an error if used inside SnackbarProvider', () => {
    const { result } = renderHook(() => useSnackbarContext(), {
      wrapper: SnackbarProvider,
    });
    expect(result.current.error).toBeUndefined();
  });

  it('should have default state initially set up', () => {
    const { result } = renderHook(() => useSnackbarContext(), {
      wrapper: SnackbarProvider,
    });

    expect(result.current.state.activeSnackbarMessage).toStrictEqual({});
  });

  it('should add a new activeMessage when addSnackbarMessage is called and new message has unique id', () => {
    const { result } = renderHook(() => useSnackbarContext(), {
      wrapper: SnackbarProvider,
    });

    act(() => {
      result.current.actions.addSnackbarMessage(MESSAGE_1);
    });

    expect(result.current.state.activeSnackbarMessage).toStrictEqual(MESSAGE_1);
  });

  it('should display only 1 activeSnackbarMessage at a time, regardless of how many are in the queue', () => {
    const { result } = renderHook(() => useSnackbarContext(), {
      wrapper: SnackbarProvider,
    });

    act(() => {
      result.current.actions.addSnackbarMessage(MESSAGE_1);
    });
    expect(result.current.state.activeSnackbarMessage).toStrictEqual(MESSAGE_1);

    // A second message is added to the queue but not as an activeSnackbarMessage
    act(() => {
      result.current.actions.addSnackbarMessage(MESSAGE_2);
    });

    expect(result.current.state.activeSnackbarMessage).toStrictEqual(MESSAGE_1);

    // When the message that was already displayed when the second message is added
    // is dismissed or times out, the second message becomes the activeSnackbarMessage
    act(() => {
      result.current.actions.removeSnackbarMessage(MESSAGE_1.id);
    });

    expect(result.current.state.activeSnackbarMessage).toStrictEqual(MESSAGE_2);

    // When that message is dismissed or times out and there are no pending messages to display
    // activeSnackbarMessage returns to empty object
    act(() => {
      result.current.actions.removeSnackbarMessage(MESSAGE_2.id);
    });

    expect(result.current.state.activeSnackbarMessage).toStrictEqual({});
  });
});
