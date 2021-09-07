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

const OPTIONS = [
  { id: 1, label: 'apple', checked: false },
  { id: 2, label: 'banana', checked: false },
  { id: 3, label: 'cantaloupe', checked: true },
  { id: 4, label: 'papaya', checked: false },
  { id: 5, label: 'zebra fish', checked: true },
];

describe('Hierarchical', () => {
  it('typing in the list should filter the options', () => {
    renderWithProviders(
      <Hierarchical label="Categories" options={OPTIONS} onChange={noop} />
    );
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'ap' } });

    const options = screen.queryAllByRole('checkbox');

    expect(options).toHaveLength(2);
  });
});
