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
import { fireEvent, screen } from '@testing-library/preact';

/**
 * Internal dependencies
 */
import Switch from '../switch';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop } from '../../../utils';

describe('Switch', () => {
  it('should render the switch', () => {
    renderWithProviders(
      <Switch
        name="radioOne"
        groupLabel="radio one"
        offLabel="OFF"
        onLabel="ON"
        onChange={noop}
        value={false}
      />
    );

    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByText('ON')).toBeInTheDocument();
    expect(screen.getByText('OFF')).toBeInTheDocument();
  });

  it.each`
    value
    ${true}
    ${false}
  `(
    'should call onChange with the value of the unchecked radio button when the value is `$value`',
    ({ value }) => {
      const onChange = jest.fn();
      renderWithProviders(
        <Switch
          name="radioOne"
          groupLabel="radio one"
          offLabel="OFF"
          onLabel="ON"
          onChange={onChange}
          value={value}
        />
      );

      const radioButton = screen.getByRole('radio', { checked: false });
      fireEvent.click(radioButton);

      expect(onChange).toHaveBeenCalledWith(expect.any(Object), !value);
    }
  );
});
