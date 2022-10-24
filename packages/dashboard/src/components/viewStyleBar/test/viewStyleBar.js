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

/**
 * Internal dependencies
 */
import { VIEW_STYLE } from '../../../constants';
import { renderWithProviders } from '../../../testUtils';
import ViewStyleBar from '..';

describe('<ViewStyleBar />', () => {
  const mockPress = jest.fn();

  it(`should render the list icon when layoutStyle is ${VIEW_STYLE.GRID}`, () => {
    renderWithProviders(
      <ViewStyleBar layoutStyle={VIEW_STYLE.GRID} onPress={mockPress} />
    );

    const listIcon = screen.getByTestId('list-icon');
    expect(listIcon).toBeInTheDocument();

    const gridIcon = screen.queryByTestId('grid-icon');
    expect(gridIcon).not.toBeInTheDocument();
  });

  it(`should render the grid icon when layoutStyle is ${VIEW_STYLE.LIST}`, () => {
    renderWithProviders(
      <ViewStyleBar layoutStyle={VIEW_STYLE.LIST} onPress={mockPress} />
    );

    const gridIcon = screen.getByTestId('grid-icon');
    expect(gridIcon).toBeInTheDocument();

    const listIcon = screen.queryByTestId('list-icon');
    expect(listIcon).not.toBeInTheDocument();
  });

  it('should have triggered mockPress once on onPress click', () => {
    renderWithProviders(
      <ViewStyleBar layoutStyle={VIEW_STYLE.LIST} onPress={mockPress} />
    );

    const gridIcon = screen.getByTestId('grid-icon');

    fireEvent.click(gridIcon);
    expect(mockPress).toHaveBeenCalledOnce();
  });
});
