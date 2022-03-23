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
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { __ } from '@googleforcreators/i18n';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import RadioGroup from '../radioGroup';

describe('RadioGroup', () => {
  const options = [
    {
      value: 'a',
      label: __('Option A', 'web-stories'),
      helper: __('This is the best option', 'web-stories'),
    },
    {
      value: 'b',
      label: __('Option B', 'web-stories'),
      helper: __('Also a good option', 'web-stories'),
    },
  ];

  it('should render with correct options', () => {
    renderWithTheme(
      <RadioGroup
        name="test"
        groupLabel="test"
        onChange={() => null}
        options={options}
        value={options[0].value}
      />
    );

    const optionA = screen.getByRole('radio', { name: 'Option A' });
    const optionB = screen.getByRole('radio', { name: 'Option B' });

    expect(optionA).toBeInTheDocument();
    expect(optionA).toBeChecked();
    expect(optionB).toBeInTheDocument();
  });

  it('should change the value when clicking', () => {
    const onChange = jest.fn();

    renderWithTheme(
      <RadioGroup
        name="test"
        groupLabel="test"
        onChange={onChange}
        options={options}
        value={options[0].value}
      />
    );
    const optionB = screen.getByRole('radio', { name: 'Option B' });
    fireEvent.click(optionB);
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
