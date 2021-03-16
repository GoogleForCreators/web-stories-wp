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
import { render, screen, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import BlockTypeSwitcher from '../blockTypeSwitcher';

describe('Tests BlockTypeSwitcher', () => {
  it('should render block type switcher without errors', () => {
    const setAttributes = jest.fn();
    render(
      <BlockTypeSwitcher selectedBlockType={''} setAttributes={setAttributes} />
    );

    const switchButton = screen.getByLabelText('Block Sub Type');
    expect(switchButton).toBeInTheDocument();
  });

  it('should call setAttribute on block type change', async () => {
    const setAttributes = jest.fn();
    render(
      <BlockTypeSwitcher selectedBlockType={''} setAttributes={setAttributes} />
    );

    const switchButton = screen.getByLabelText('Block Sub Type');

    // Opens Switcher dropdown menu.
    fireEvent.click(switchButton);

    const selectionMenu = await screen.findByRole('menu');

    // Assert that the menu exists.
    expect(selectionMenu).toBeInTheDocument();

    const menuItem = screen.getByText('Latest Stories');

    // Select block type.
    fireEvent.click(menuItem);

    // Confirm that the menuItem was clicked.
    expect(setAttributes).toHaveBeenCalledTimes(1);
  });
});
