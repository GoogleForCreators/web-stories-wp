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
import { fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { SnackbarMessage } from '../snackbarMessage';
import { AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX } from '../constants';
import { noop } from '../../../utils/noop';

describe('design-system/components/snackbar/SnackbarMessage', () => {
  beforeEach(jest.clearAllMocks);

  const mockHandleDismiss = jest.fn();

  it('should render 1 alert', () => {
    const wrapper = renderWithProviders(
      <SnackbarMessage
        message="this is an error"
        aria-label="aria label for my alert"
        handleDismiss={mockHandleDismiss}
      />
    );

    const alert = wrapper.getByRole('alert');

    expect(alert).toBeInTheDocument();
  });

  it(`should trigger mockHandleDismiss after ${AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX}ms`, async () => {
    jest.useFakeTimers();
    jest.setTimeout(AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX + 500);

    renderWithProviders(
      <SnackbarMessage
        message="this is an error"
        aria-label="aria label for my alert"
        handleDismiss={mockHandleDismiss}
      />
    );
    jest.runAllTimers();
    await waitFor(() => expect(mockHandleDismiss).toHaveBeenCalledTimes(1));
  });

  it('should call mockHandleDismiss when the close button is clicked', () => {
    const { getByRole } = renderWithProviders(
      <SnackbarMessage
        aria-label="aria label for my alert"
        message="this is an error"
        handleDismiss={mockHandleDismiss}
        showCloseButton
      />
    );

    expect(mockHandleDismiss).not.toHaveBeenCalled();

    const closeButton = getByRole('button');

    fireEvent.click(closeButton);

    expect(mockHandleDismiss).toHaveBeenCalledTimes(1);
  });

  it('should not render a button if showCloseButton is false', () => {
    const { queryByRole } = renderWithProviders(
      <SnackbarMessage
        aria-label="aria label for my alert"
        message="this is an error"
        handleDismiss={noop}
        showCloseButton={false}
      />
    );
    const buttons = queryByRole('button');

    expect(buttons).not.toBeInTheDocument();
  });

  it('should recognize click on Action button', () => {
    const mockActionClick = jest.fn();
    const { getByText } = renderWithProviders(
      <SnackbarMessage
        aria-label="aria label for my alert"
        message="this is an error"
        handleAction={mockActionClick}
        handleDismiss={noop}
        actionLabel="retry"
      />
    );

    const button = getByText('retry');

    fireEvent.click(button);

    expect(mockActionClick).toHaveBeenCalledTimes(1);
  });
});
