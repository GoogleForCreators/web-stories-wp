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
import Checkbox from '../checkbox';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop } from '../../../utils';

describe('Checkbox', () => {
  it('should render the checkbox', () => {
    renderWithProviders(<Checkbox onChange={noop} />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render the checkmark if the checkbox is checked', () => {
    renderWithProviders(<Checkbox onChange={noop} checked />);

    expect(screen.getByRole('img', { name: 'Checked' })).toBeInTheDocument();
  });

  it('should not render the checkmark if the checkbox is not checked', () => {
    renderWithProviders(<Checkbox onChange={noop} />);

    expect(
      screen.queryByRole('img', { name: 'Checked' })
    ).not.toBeInTheDocument();
  });
});
