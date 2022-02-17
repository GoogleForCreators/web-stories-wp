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
// eslint-disable-next-line import/no-internal-modules -- Importing testUtils is OK.
import { renderWithProviders } from '@googleforcreators/design-system/src/testUtils';

/**
 * Internal dependencies
 */
import Hierarchical, { makeFlatOptionTree } from '..';
import { noop } from '../../../../utils/noop';

const OPTIONS = [
  { id: 1, label: 'apple', checked: false },
  { id: 'fitty', label: 'corgi', checked: true, parent: 1 },
  { id: 'sixty', label: 'morgi', checked: true, parent: 1 },
  { id: 'gritty', label: 'borky', checked: true, parent: 'sixty' },
  { id: 2, label: 'banana', checked: false },
  { id: 3, label: 'cantaloupe', checked: true },
  { id: 4, label: 'papaya', checked: false },
  { id: '100', label: 'trees', checked: true, parent: 4 },
  { id: '1001', label: 'porgi', checked: true, parent: '100' },
  { id: '10011', label: 'hal', checked: true, parent: '100' },
  { id: 5, label: 'zebra fish', checked: true },
];

describe('Hierarchical', () => {
  it('clicking a checkbox should call onChange with the path and new value', () => {
    const onChange = jest.fn();

    renderWithProviders(
      <Hierarchical
        inputValue=""
        onInputChange={noop}
        label="Categories"
        options={makeFlatOptionTree(OPTIONS)}
        onChange={onChange}
        noOptionsText="no options found"
      />
    );

    const initialCheckboxLength = screen.getAllByRole('checkbox').length;

    const appleCheckbox = screen.getByRole('checkbox', { name: 'apple' });
    const morgiCheckbox = screen.getByRole('checkbox', { name: 'morgi' });
    const treesCheckbox = screen.getByRole('checkbox', { name: 'trees' });
    const zebraFishCheckbox = screen.getByRole('checkbox', {
      name: 'zebra fish',
    });

    fireEvent.click(appleCheckbox);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), {
      id: 1,
      checked: true,
    });

    fireEvent.click(morgiCheckbox);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), {
      id: 'sixty',
      checked: false,
    });

    fireEvent.click(treesCheckbox);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), {
      id: '100',
      checked: false,
    });

    fireEvent.click(zebraFishCheckbox);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), {
      id: 5,
      checked: false,
    });

    expect(screen.getAllByRole('checkbox')).toHaveLength(initialCheckboxLength);
  });

  it('should check the correct box when items are filtered', () => {
    const onChange = jest.fn();

    renderWithProviders(
      <Hierarchical
        inputValue="orgi"
        onInputChange={noop}
        label="Categories"
        options={makeFlatOptionTree(OPTIONS, 'orgi')}
        onChange={onChange}
        noOptionsText="no options found"
      />
    );

    const initialCheckboxLength = screen.getAllByRole('checkbox').length;

    const appleCheckbox = screen.getByRole('checkbox', { name: 'apple' });
    const morgiCheckbox = screen.getByRole('checkbox', { name: 'morgi' });

    fireEvent.click(appleCheckbox);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), {
      id: 1,
      checked: true,
    });

    fireEvent.click(morgiCheckbox);

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), {
      id: 'sixty',
      checked: false,
    });

    expect(screen.getAllByRole('checkbox')).toHaveLength(initialCheckboxLength);
  });
});
