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
import { fireEvent } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../../../design-system/testUtils/renderWithProviders';
import { Toggle } from '..';

describe('help center toggle <Toggle />', () => {
  it('should render', () => {
    const { getByRole } = renderWithProviders(<Toggle />);

    const toggle = getByRole('button');
    expect(toggle).toBeInTheDocument();
  });

  it('should have propper aria attributes when closed', () => {
    const { getByRole } = renderWithProviders(<Toggle />);

    const toggle = getByRole('button');
    expect(toggle).toHaveAttribute('aria-haspopup');
  });

  it('should have propper aria attributes when open', () => {
    const popupId = 'id-for-popup';
    const { getByRole } = renderWithProviders(
      <Toggle isOpen={true} popupId={popupId} />
    );

    const toggle = getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded');
    expect(toggle).toHaveAttribute('aria-pressed');
    expect(toggle).toHaveAttribute('aria-owns', popupId);
  });

  it('should fire onClick event when clicked', () => {
    const onClickMock = jest.fn();
    const { getByRole } = renderWithProviders(<Toggle onClick={onClickMock} />);

    const toggle = getByRole('button');
    fireEvent.click(toggle);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
