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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../../testUtils';
import EffectInput from '../effectInput';
import { FIELD_TYPES } from '../../../../../../animation';

describe('<EffectInput />', () => {
  const testFieldKey = 'testField';
  const testValue = 500;
  const defaultProps = {
    effectProps: {
      [testFieldKey]: {
        type: FIELD_TYPES.NUMBER,
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
    const { getByLabelText } = renderWithTheme(
      <EffectInput {...defaultProps} />
    );
    const input = getByLabelText(testFieldKey);
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
});
