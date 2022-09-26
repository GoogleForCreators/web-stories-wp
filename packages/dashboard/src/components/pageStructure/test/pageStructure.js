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
import { renderWithProviders } from '../../../testUtils';
import { LeftRail } from '..';
import { NavContext } from '../../navProvider';
import { PRIMARY_PATHS } from '../../../constants';

describe('<LeftRail />', () => {
  const toggleSideBarFn = jest.fn();

  const MockedNavProvider = ({ children }) => {
    return (
      <NavContext.Provider
        value={{
          actions: {
            toggleSideBar: toggleSideBarFn,
          },
          state: { sideBarVisible: false },
        }}
      >
        {children}
      </NavContext.Provider>
    );
  };

  it('should be visible by default in a regular viewport.', () => {
    renderWithProviders(
      <MockedNavProvider>
        <LeftRail />
      </MockedNavProvider>
    );

    const leftRail = screen.getByTestId('dashboard-left-rail');
    const visibility = window.getComputedStyle(leftRail).visibility;

    expect(visibility).toBe('visible');
  });

  it('should call the toggle sidebar function when a link is clicked to close the menu.', () => {
    renderWithProviders(
      <MockedNavProvider>
        <LeftRail />
      </MockedNavProvider>
    );

    expect(toggleSideBarFn).not.toHaveBeenCalled();

    const firstLink = screen.getByText(PRIMARY_PATHS[0].label);
    fireEvent.click(firstLink);

    expect(toggleSideBarFn).toHaveBeenCalledWith();
  });
});
