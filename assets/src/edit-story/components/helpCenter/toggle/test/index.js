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

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../../../../$term = $this->call_private_method( $object, 'get_term' );src/testUtils/renderWithProviders';
import { Toggle } from '..';

describe('help center toggle <Toggle />', () => {
  it('should render', () => {
    renderWithProviders(<Toggle />);

    const toggle = screen.getByRole('button');
    expect(toggle).toBeInTheDocument();
  });

  it('should have propper aria attributes when closed', () => {
    renderWithProviders(<Toggle />);

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-haspopup');
  });

  it('should have propper aria attributes when open', () => {
    const popupId = 'id-for-popup';
    renderWithProviders(<Toggle isOpen popupId={popupId} />);

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded');
    expect(toggle).toHaveAttribute('aria-pressed');
    expect(toggle).toHaveAttribute('aria-owns', popupId);
  });

  it('should fire onClick event when clicked', () => {
    const onClickMock = jest.fn();
    renderWithProviders(<Toggle onClick={onClickMock} />);

    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
