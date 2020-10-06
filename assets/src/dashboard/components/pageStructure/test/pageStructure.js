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
import { useState } from 'react';
import { fireEvent } from '@testing-library/react';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils';
import { LeftRail } from '../index';
import NavProvider, { NavContext } from '../../navProvider';
import { PRIMARY_PATHS } from '../../../constants';

describe('<LeftRail />', () => {
  it('should be visible by default in a regular viewport.', () => {
    const wrapper = renderWithProviders(
      <FlagsProvider features={{ enableInProgressViews: false }}>
        <NavProvider>
          <LeftRail />
        </NavProvider>
      </FlagsProvider>
    );

    const leftRail = wrapper.getByTestId('dashboard-left-rail');
    const visibility = window.getComputedStyle(leftRail).visibility;

    expect(visibility).toBe('visible');
  });

  it('should call the toggle sidebar function when a link is clicked to close the menu.', () => {
    const toggleSideBarFn = jest.fn();

    // eslint-disable-next-line react/prop-types
    const MockedNavProvider = ({ children, toggleSideBar }) => {
      const [sideBarVisible] = useState(false);
      return (
        <NavContext.Provider
          value={{
            actions: { toggleSideBar },
            state: { sideBarVisible },
          }}
        >
          {children}
        </NavContext.Provider>
      );
    };
    const wrapper = renderWithProviders(
      <FlagsProvider features={{ enableInProgressViews: false }}>
        <MockedNavProvider toggleSideBar={toggleSideBarFn}>
          <LeftRail />
        </MockedNavProvider>
      </FlagsProvider>
    );

    expect(toggleSideBarFn).not.toHaveBeenCalled();

    const firstLink = wrapper.getByText(PRIMARY_PATHS[0].label);
    fireEvent.click(firstLink);

    expect(toggleSideBarFn).toHaveBeenCalledWith();
  });
});
