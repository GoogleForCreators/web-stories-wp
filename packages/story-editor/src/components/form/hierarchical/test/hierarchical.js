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
import { renderWithProviders } from '@web-stories-wp/design-system/src/testUtils';

/**
 * Internal dependencies
 */
import Hierarchical from '..';
import { noop } from '../../../../utils/noop';

describe('Hierarchical', () => {
  it('typing in the list should filter the first level options', () => {
    renderWithProviders(
      <Hierarchical
        label="Categories"
        options={[
          { id: 1, label: 'apple', checked: false },
          { id: 2, label: 'banana', checked: false },
          { id: 3, label: 'cantaloupe', checked: true },
        ]}
        onChange={noop}
      />
    );
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'p' } });

    const options = screen.getAllByRole('checkbox');

    expect(options).toHaveLength(2);
    expect(screen.getByRole('checkbox', { name: 'apple' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'cantaloupe' })
    ).toBeInTheDocument();
  });

  it('typing in the list should filter nested options', () => {
    renderWithProviders(
      <Hierarchical
        label="Categories"
        options={[
          {
            id: 1,
            label: 'apple',
            checked: false,
            options: [
              { id: 'fitty', label: 'corgi', checked: true },
              {
                id: 'sixty',
                label: 'morgi',
                checked: true,
                options: [{ id: 'gritty', label: 'borky', checked: true }],
              },
            ],
          },
          { id: 2, label: 'banana', checked: false },
          { id: 3, label: 'cantaloupe', checked: true },
          {
            id: 4,
            label: 'papaya',
            checked: false,
            options: [
              {
                id: '100',
                label: 'trees',
                checked: true,
                options: [
                  { id: '1001', label: 'porgi', checked: true },
                  { id: '10011', label: 'hal', checked: true },
                ],
              },
            ],
          },
          { id: 5, label: 'zebra fish', checked: true },
        ]}
        onChange={noop}
      />
    );
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'orgi' } });

    const options = screen.getAllByRole('checkbox');

    expect(options).toHaveLength(6);
    expect(screen.getByRole('checkbox', { name: 'apple' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'corgi' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'morgi' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'papaya' })
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'trees' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'porgi' })).toBeInTheDocument();
  });
});
