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
import { fireEvent } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils';
import StoryMenu from '../';
import { STORY_CONTEXT_MENU_ITEMS } from '../../../constants';

describe('StoryMenu', () => {
  it('should render a button by default', () => {
    const { getByRole } = renderWithProviders(
      <StoryMenu
        onMoreButtonSelected={jest.fn}
        contextMenuId={1}
        onMenuItemSelected={jest.fn}
        menuItems={STORY_CONTEXT_MENU_ITEMS}
        story={{ id: 1, status: 'publish', title: 'Sample Story' }}
      />
    );

    const menuButton = getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });

  it('should get access to menu on button click', () => {
    const mockOnMoreButtonSelected = jest.fn();

    const { getByRole } = renderWithProviders(
      <StoryMenu
        onMoreButtonSelected={mockOnMoreButtonSelected}
        contextMenuId={1}
        onMenuItemSelected={jest.fn}
        menuItems={STORY_CONTEXT_MENU_ITEMS}
        story={{ id: 1, status: 'publish', title: 'Sample Story' }}
      />
    );

    const menuButton = getByRole('button');
    fireEvent.click(menuButton);
    expect(mockOnMoreButtonSelected).toHaveBeenCalledTimes(1);
  });

  it('should call onMenuItemSelected when menu item is clicked', () => {
    const mockMenuItemSelected = jest.fn();

    const { getAllByRole } = renderWithProviders(
      <StoryMenu
        onMoreButtonSelected={jest.fn}
        contextMenuId={1}
        onMenuItemSelected={mockMenuItemSelected}
        menuItems={STORY_CONTEXT_MENU_ITEMS}
        story={{ id: 1, status: 'publish', title: 'Sample Story' }}
      />
    );

    const menuItem = getAllByRole('listitem')[0];
    fireEvent.click(menuItem);
    expect(mockMenuItemSelected).toHaveBeenCalledTimes(1);
  });
});
