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

/**
 * Internal dependencies
 */
import { Checkbox } from '../';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Checkbox', () => {
  it('should render the checkbox', () => {
    const { getByTestId } = renderWithProviders(
      <Checkbox data-testid="checkbox" />
    );

    expect(getByTestId('checkbox')).toBeInTheDocument();
  });

  it('should render the checkmark if the checkbox is checked', () => {
    const { getByTestId } = renderWithProviders(
      <Checkbox data-testid="checkbox" checked />
    );

    expect(getByTestId('checkbox-checkmark')).toBeInTheDocument();
  });

  it('should not render the checkmark if the checkbox is not checked', () => {
    const { queryByTestId } = renderWithProviders(
      <Checkbox data-testid="checkbox" />
    );

    expect(queryByTestId('checkbox-checkmark')).not.toBeInTheDocument();
  });
});
