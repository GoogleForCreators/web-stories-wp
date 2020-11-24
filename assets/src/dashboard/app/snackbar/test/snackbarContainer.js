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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/';
import SnackbarContainer from '../snackbarContainer';

const testMessage = {
  message: {
    body: 'i am an error',
    title: 'i am some extra context for a label',
  },
  id: 1997687,
};

describe('app/snackbar/snackbarContainer', () => {
  const mockRemoveSnackbarMessageClick = jest.fn();
  it('should have 1 active snackbar message', () => {
    const { getByRole } = renderWithProviders(
      <SnackbarContainer
        activeSnackbarMessage={testMessage}
        handleDismissMessage={mockRemoveSnackbarMessageClick}
      />
    );

    const alert = getByRole('alert');

    expect(alert).toBeInTheDocument();
  });

  it('should render message.body visibly and message.title as aria label', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SnackbarContainer
        activeSnackbarMessage={testMessage}
        handleDismissMessage={mockRemoveSnackbarMessageClick}
      />
    );

    const displayText = getByText(testMessage.message.body);
    expect(displayText).toBeInTheDocument();

    const labelText = getByLabelText(testMessage.message.title);
    expect(labelText).toBeInTheDocument();
  });

  it('should dismiss alert after 10000ms (default)', async () => {
    jest.useFakeTimers();
    jest.setTimeout(10500);

    const { getByRole } = renderWithProviders(
      <SnackbarContainer
        activeSnackbarMessage={testMessage}
        handleDismissMessage={mockRemoveSnackbarMessageClick}
      />
    );

    expect(getByRole('alert')).toBeInTheDocument();
    jest.runAllTimers();
    await waitFor(() =>
      expect(mockRemoveSnackbarMessageClick).toHaveBeenCalledTimes(1)
    );
  });
});
