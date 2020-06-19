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
import ToastProvider from '../provider';
import useToastContext from '../useToastContext';
import { ALERT_SEVERITY } from '../../../constants';

const TOAST_1 = {
  message: 'one',
  severity: ALERT_SEVERITY.ERROR,
  id: 1,
  isActive: true,
};

const TOAST_2 = {
  message: 'two',
  id: 2,
  severity: ALERT_SEVERITY.ERROR,
  isActive: true,
};

const TOAST_3 = {
  message: 'three',
  id: 3,
  severity: ALERT_SEVERITY.WARNING,
  isActive: true,
};

describe('useToastContext', () => {
  it('should throw an error if used outside of Toast.Provider', () => {
    expect(() => {
      const {
        // eslint-disable-next-line no-unused-vars
        result: { current },
      } = renderHook(() => useToastContext());
    }).toThrow(
      Error('useToasterContext() must be used within a <Toast.Provider />')
    );
  });

  it('should not throw an error if used inside ToastProvider', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    expect(result.current.error).toBeUndefined();
  });

  it('should have default state initially set up', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });

    expect(result.current.state.activeToasts).toStrictEqual([]);
  });

  it('should add a new activeToast when addToast is called and new toast has unique id', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.actions.addToast(TOAST_1);
    });

    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1]);
  });

  it('should not add a duplicate activeToast when addToast is called with existing toast id', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    act(() => {
      result.current.actions.addToast(TOAST_1);
    });

    act(() => {
      result.current.actions.addToast(TOAST_1);
    });

    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1]);
  });

  it('should remove an activeToast but maintain allToasts when removeToast is called', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.actions.addToast(TOAST_1);
    });
    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1]);

    act(() => {
      result.current.actions.addToast(TOAST_2);
    });
    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1, TOAST_2]);

    act(() => {
      result.current.actions.removeToast(TOAST_2.id);
    });

    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1]);

    act(() => {
      result.current.actions.removeToast(TOAST_1.id);
    });
    expect(result.current.state.activeToasts).toStrictEqual([]);
  });

  it('should reset allToasts when resetToasts is called', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    act(() => {
      result.current.actions.addToast(TOAST_1);
    });
    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1]);

    act(() => {
      result.current.actions.addToast(TOAST_3);
    });
    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1, TOAST_3]);

    act(() => {
      result.current.actions.removeToast(TOAST_3.id);
    });
    expect(result.current.state.activeToasts).toStrictEqual([TOAST_1]);

    act(() => {
      result.current.actions.resetToasts();
    });

    expect(result.current.state.activeToasts).toStrictEqual([]);
  });
});
