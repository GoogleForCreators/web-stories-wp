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
import { fireEvent } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { Switch } from '..';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop } from '../../../utils';

describe('Switch', () => {
  it('should render the switch', () => {
    const { getAllByRole, getByText } = renderWithProviders(
      <Switch
        name="radioOne"
        groupLabel="radio one"
        offLabel="OFF"
        onLabel="ON"
        onChange={noop}
        value={false}
      />
    );

    expect(getAllByRole('radio')).toHaveLength(2);
    expect(getByText('ON')).toBeInTheDocument();
    expect(getByText('OFF')).toBeInTheDocument();
  });

  it.each`
    value
    ${true}
    ${false}
  `(
    'should call onChange with the value of the unchecked radio button when the value is `$value`',
    ({ value }) => {
      const onChange = jest.fn();
      const { getByRole } = renderWithProviders(
        <Switch
          name="radioOne"
          groupLabel="radio one"
          offLabel="OFF"
          onLabel="ON"
          onChange={onChange}
          value={value}
        />
      );

      const radioButton = getByRole('radio', { checked: false });
      fireEvent.click(radioButton);

      expect(onChange).toHaveBeenCalledWith(expect.any(Object), !value);
    }
  );
});
