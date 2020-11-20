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
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/';
import SnackbarContainer from '../snackbarContainer';

const testMessage = {
  message: 'i am an error',
  id: 1,
};

// TODO add more
describe('SnackbarContainer', () => {
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
});
