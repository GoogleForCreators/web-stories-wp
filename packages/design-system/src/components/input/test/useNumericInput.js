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
import { act, renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useNumericInput } from '../useNumericInput';

const mockOnChange = jest.fn();

describe('useNumericInput', () => {
  beforeEach(jest.clearAllMocks);

  it('should set initial state', () => {
    const { result } = renderHook(() =>
      useNumericInput({
        allowEmpty: false,
        isFloat: false,
        onChange: mockOnChange,
        value: 1,
      })
    );

    expect(result.current.currentValue).toBe(1);
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(result.current.inputRef.current).toBeNull();
  });

  describe('handleChange', () => {
    it('should set internal state', () => {
      const { result } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          value: 1,
        })
      );

      act(() => {
        result.current.handleChange({ target: { value: '12' } });
      });
      expect(result.current.currentValue).toBe('12');
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('handleBlur', () => {
    it('should call `onChange`', () => {
      const { result } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          value: 1,
        })
      );

      // fire with internal value unchanged
      act(() => {
        result.current.handleBlur('dummy data');
      });
      expect(mockOnChange).toHaveBeenCalledTimes(0);

      // change internal value
      act(() => {
        result.current.handleChange({ target: { value: '1234' } });
      });

      // fire with internal value changed
      act(() => {
        result.current.handleBlur('dummy data');
      });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('dummy data', 1234);
    });

    it('should call onChange with a valid value when the current value is over max', () => {
      const { result } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          max: 10,
          value: 15,
        })
      );

      // fire with internal value unchanged
      act(() => {
        result.current.handleBlur('dummy data');
      });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('dummy data', 10);
    });

    it('should call onChange with a valid value when the current value is under min', () => {
      const { result } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          min: 20,
          value: 15,
        })
      );

      // fire with internal value unchanged
      act(() => {
        result.current.handleBlur('dummy data');
      });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('dummy data', 20);
    });

    it('should not call onChange when the new value is invalid', () => {
      const { result } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          value: 1,
        })
      );

      // change internal value
      act(() => {
        result.current.handleChange({ target: { value: 'abvde' } });
      });

      // blur field now that value is changed
      act(() => {
        result.current.handleBlur('dummy data');
      });
      expect(mockOnChange).toHaveBeenCalledTimes(0);
    });
  });

  describe('handleKeyUpDown', () => {
    it.each`
      initialValue | key            | altKey   | isFloat  | max          | min          | finalValue
      ${1}         | ${'ArrowUp'}   | ${false} | ${false} | ${undefined} | ${undefined} | ${2}
      ${1}         | ${'ArrowDown'} | ${false} | ${false} | ${undefined} | ${undefined} | ${0}
      ${1.01}      | ${'ArrowUp'}   | ${false} | ${true}  | ${undefined} | ${undefined} | ${2.01}
      ${1.01}      | ${'ArrowDown'} | ${false} | ${true}  | ${undefined} | ${undefined} | ${0.01}
      ${1}         | ${'ArrowUp'}   | ${true}  | ${false} | ${undefined} | ${undefined} | ${2}
      ${1}         | ${'ArrowDown'} | ${true}  | ${false} | ${undefined} | ${undefined} | ${0}
      ${1.01}      | ${'ArrowUp'}   | ${true}  | ${true}  | ${undefined} | ${undefined} | ${1.11}
      ${1.01}      | ${'ArrowDown'} | ${true}  | ${true}  | ${undefined} | ${undefined} | ${0.91}
      ${10}        | ${'ArrowUp'}   | ${false} | ${false} | ${10}        | ${undefined} | ${10}
      ${-2}        | ${'ArrowDown'} | ${false} | ${false} | ${undefined} | ${-2}        | ${-2}
      ${10}        | ${'ArrowUp'}   | ${false} | ${true}  | ${10}        | ${undefined} | ${10}
      ${-2}        | ${'ArrowDown'} | ${false} | ${true}  | ${undefined} | ${-2}        | ${-2}
      ${10}        | ${'ArrowUp'}   | ${true}  | ${false} | ${10}        | ${undefined} | ${10}
      ${-2}        | ${'ArrowDown'} | ${true}  | ${false} | ${undefined} | ${-2}        | ${-2}
      ${10}        | ${'ArrowUp'}   | ${true}  | ${true}  | ${10}        | ${undefined} | ${10}
      ${-2}        | ${'ArrowDown'} | ${true}  | ${true}  | ${undefined} | ${-2}        | ${-2}
    `(
      '`$key`: should call onChange with `$finalValue` when the current value is $initialValue and options are `{ initialValue: $initialValue, altKey: $altKey, key: $key, isFloat: $isFloat, max: $max, min: $min }`',
      ({ initialValue, key, altKey, isFloat, max, min, finalValue }) => {
        const { result } = renderHook(() =>
          useNumericInput({
            allowEmpty: false,
            isFloat,
            onChange: mockOnChange,
            max,
            min,
            value: initialValue,
          })
        );

        act(() => {
          result.current.handleKeyUpAndDown({ altKey, key });
        });
        expect(mockOnChange).toHaveBeenCalledWith({ altKey, key }, finalValue);
      }
    );

    it.each`
      key            | altKey   | isFloat  | max          | min          | finalValue
      ${'ArrowUp'}   | ${false} | ${false} | ${undefined} | ${undefined} | ${1}
      ${'ArrowDown'} | ${false} | ${false} | ${undefined} | ${undefined} | ${-1}
      ${'ArrowUp'}   | ${false} | ${true}  | ${undefined} | ${undefined} | ${1}
      ${'ArrowDown'} | ${false} | ${true}  | ${undefined} | ${undefined} | ${-1}
      ${'ArrowUp'}   | ${true}  | ${false} | ${undefined} | ${undefined} | ${1}
      ${'ArrowDown'} | ${true}  | ${false} | ${undefined} | ${undefined} | ${-1}
      ${'ArrowUp'}   | ${true}  | ${true}  | ${undefined} | ${undefined} | ${0.1}
      ${'ArrowDown'} | ${true}  | ${true}  | ${undefined} | ${undefined} | ${-0.1}
      ${'ArrowUp'}   | ${false} | ${false} | ${10}        | ${undefined} | ${1}
      ${'ArrowDown'} | ${false} | ${false} | ${undefined} | ${-2}        | ${-1}
      ${'ArrowUp'}   | ${false} | ${true}  | ${10}        | ${undefined} | ${1}
      ${'ArrowDown'} | ${false} | ${true}  | ${undefined} | ${-2}        | ${-1}
      ${'ArrowUp'}   | ${true}  | ${false} | ${10}        | ${undefined} | ${1}
      ${'ArrowDown'} | ${true}  | ${false} | ${undefined} | ${-2}        | ${-1}
      ${'ArrowUp'}   | ${true}  | ${true}  | ${10}        | ${undefined} | ${0.1}
      ${'ArrowDown'} | ${true}  | ${true}  | ${undefined} | ${-2}        | ${-0.1}
      ${'ArrowUp'}   | ${false} | ${false} | ${0}         | ${undefined} | ${0}
      ${'ArrowDown'} | ${false} | ${false} | ${undefined} | ${1}         | ${1}
      ${'ArrowUp'}   | ${false} | ${true}  | ${0}         | ${undefined} | ${0}
      ${'ArrowDown'} | ${false} | ${true}  | ${undefined} | ${1}         | ${1}
      ${'ArrowUp'}   | ${true}  | ${false} | ${0}         | ${undefined} | ${0}
      ${'ArrowDown'} | ${true}  | ${false} | ${undefined} | ${1}         | ${1}
      ${'ArrowUp'}   | ${true}  | ${true}  | ${0}         | ${undefined} | ${0}
      ${'ArrowDown'} | ${true}  | ${true}  | ${undefined} | ${1}         | ${1}
    `(
      '`$key`: should call onChange with `$finalValue` when the current value is invalid and options are `{ altKey: $altKey, key: $key, isFloat: $isFloat, max: $max, min: $min }`',
      ({ key, altKey, isFloat, max, min, finalValue }) => {
        const { result } = renderHook(() =>
          useNumericInput({
            allowEmpty: false,
            isFloat,
            onChange: mockOnChange,
            max,
            min,
            value: 1,
          })
        );

        // set internal value to something 'invalid'
        act(() => {
          result.current.handleChange({ target: { value: 'not-a-number' } });
        });

        act(() => {
          result.current.handleKeyUpAndDown({ altKey, key });
        });
        expect(mockOnChange).toHaveBeenCalledWith({ altKey, key }, finalValue);
      }
    );
  });

  describe('handleEsc', () => {
    it('should do nothing if `inputRef` is `null`', () => {
      const mockOnBlur = jest.fn();
      const { result } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          value: 1,
        })
      );

      act(() => {
        result.current.handleEsc();
      });
      expect(mockOnBlur).not.toHaveBeenCalled();
    });

    it('should call refs `onBlur` when `handleEsc` is called', () => {
      const mockOnBlur = jest.fn();
      const { result } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          value: 1,
        })
      );

      // set inputRef
      result.current.inputRef.current = { blur: mockOnBlur };

      act(() => {
        result.current.handleEsc();
      });
      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop changes', () => {
    it('should update the currentValue when the `value` is updated externally', () => {
      let value = 1;
      const { result, rerender } = renderHook(() =>
        useNumericInput({
          allowEmpty: false,
          isFloat: false,
          onChange: mockOnChange,
          value,
        })
      );

      value = 6082;

      rerender();

      expect(result.current.currentValue).toBe(6082);
    });
  });
});
