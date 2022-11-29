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
import { fireEvent, screen } from '@testing-library/react';
import { FieldType } from '@googleforcreators/animation';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import EffectInput from '../effectInput';

describe('<EffectInput />', () => {
  const testFieldKey = 'testField';
  const testValue = 500;
  const defaultProps = {
    effectProps: {
      [testFieldKey]: {
        type: FieldType.Number,
        label: testFieldKey,
      },
    },
    effectConfig: {
      [testFieldKey]: testValue,
    },
    onChange: jest.fn(),
    field: testFieldKey,
  };

  it('should render', () => {
    renderWithTheme(<EffectInput {...defaultProps} />);
    const input = screen.getByLabelText(testFieldKey);
    expect(input).toBeInTheDocument();
  });

  it('should render falsey defined values', () => {
    renderWithTheme(
      <EffectInput {...defaultProps} effectConfig={{ [testFieldKey]: 0 }} />
    );
    const testInput = screen.getByDisplayValue(0);
    expect(testInput).toBeInTheDocument();
    expect(testInput).toHaveAttribute('aria-label', testFieldKey);
  });

  it('should reject negative values and replace with "0"', () => {
    renderWithTheme(<EffectInput {...defaultProps} />);
    const input = screen.getByLabelText(testFieldKey);
    fireEvent.change(input, {
      target: { value: '-1' },
    });
    // negative value should be reset to 0 on blur
    fireEvent.blur(input);
    expect(input.value).toBe('0');
  });
});
