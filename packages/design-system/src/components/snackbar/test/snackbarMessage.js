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
import { fireEvent, waitFor, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import SnackbarMessage from '../snackbarMessage';
import { AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX } from '../types';
import { noop } from '../../../utils/noop';

describe('design-system/components/snackbar/SnackbarMessage', () => {
  beforeEach(jest.clearAllMocks);

  const mockHandleDismiss = jest.fn();

  it('should render 1 alert', () => {
    renderWithProviders(
      <SnackbarMessage
        message="this is an error"
        aria-label="aria label for my alert"
        onDismiss={mockHandleDismiss}
      />
    );

    const alert = screen.getByRole('alert', { hidden: true });

    expect(alert).toBeInTheDocument();
  });

  it(`should trigger mockHandleDismiss after ${AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX}ms`, async () => {
    jest.useFakeTimers();
    jest.setTimeout(AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX + 500);

    renderWithProviders(
      <SnackbarMessage
        message="this is an error"
        aria-label="aria label for my alert"
        onDismiss={mockHandleDismiss}
      />
    );
    jest.runAllTimers();
    await waitFor(() => expect(mockHandleDismiss).toHaveBeenCalledOnce());
  });

  it('should call mockHandleDismiss when the close button is clicked', () => {
    renderWithProviders(
      <SnackbarMessage
        aria-label="aria label for my alert"
        message="this is an error"
        onDismiss={mockHandleDismiss}
        showCloseButton
      />
    );

    expect(mockHandleDismiss).not.toHaveBeenCalled();

    const closeButton = screen.getByRole('button');

    fireEvent.click(closeButton);

    expect(mockHandleDismiss).toHaveBeenCalledOnce();
  });

  it('should not render a button if showCloseButton is false', () => {
    renderWithProviders(
      <SnackbarMessage
        aria-label="aria label for my alert"
        message="this is an error"
        onDismiss={noop}
        showCloseButton={false}
      />
    );
    const buttons = screen.queryByRole('button');

    expect(buttons).not.toBeInTheDocument();
  });

  it('should recognize click on Action button', () => {
    const mockActionClick = jest.fn();
    renderWithProviders(
      <SnackbarMessage
        aria-label="aria label for my alert"
        message="this is an error"
        onAction={mockActionClick}
        onDismiss={noop}
        actionLabel="retry"
      />
    );

    const button = screen.getByText('retry');

    fireEvent.click(button);

    expect(mockActionClick).toHaveBeenCalledOnce();
  });
});
