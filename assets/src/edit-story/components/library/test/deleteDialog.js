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
import { waitFor, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import DeleteDialog from '../panes/media/local/deleteDialog';
import { renderWithTheme } from '../../../testUtils';
import ApiContext from '../../../app/api/context';
import MediaContext from '../../../app/media/context';
import SnackbarContext from '../../../app/snackbar/context';

const deleteMedia = jest.fn();
const deleteMediaElement = jest.fn();
const showSnackbar = jest.fn();

function setup() {
  deleteMedia.mockReset();
  deleteMediaElement.mockReset();
  showSnackbar.mockReset();

  const apiValue = {
    actions: {
      deleteMedia,
    },
  };

  const mediaValue = {
    local: {
      actions: {
        deleteMediaElement,
      },
    },
  };

  const snackbarValue = { showSnackbar };

  const { queryByText, getByRole } = renderWithTheme(
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <DeleteDialog mediaId={123} type={'image'} onClose={() => {}} />
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
  return { queryByText, getByRole };
}

describe('DeleteDialog', () => {
  it('should render', () => {
    const { queryByText, getByRole } = setup();

    expect(queryByText('Delete Image?')).toBeInTheDocument();
    expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should update server and internal state on delete', async () => {
    const { getByRole } = setup();

    // Mock out `deleteMedia`.
    let serverDeleted = false;
    deleteMedia.mockImplementation(() => {
      serverDeleted = true;
    });

    // Mock out `deleteMediaElement`.
    let stateDeleted = false;
    deleteMediaElement.mockImplementation(() => {
      stateDeleted = true;
    });

    fireEvent.click(getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(deleteMedia).toHaveBeenCalledTimes(1));
    expect(deleteMediaElement).toHaveBeenCalledTimes(1);

    expect(serverDeleted).toBe(true);
    expect(stateDeleted).toBe(true);
  });

  it('should show snackbar if error on delete from server', async () => {
    const { getByRole } = setup();

    // Mock out `deleteMedia`.
    deleteMedia.mockImplementation(() => {
      throw Error;
    });

    fireEvent.click(getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(deleteMedia).toHaveBeenCalledTimes(1));
    expect(deleteMediaElement).toHaveBeenCalledTimes(0);
    expect(showSnackbar).toHaveBeenCalledTimes(1);
  });

  it('should show snackbar if error on delete from state', async () => {
    const { getByRole } = setup();

    // Mock out `deleteMediaElement`.
    deleteMediaElement.mockImplementation(() => {
      throw Error;
    });

    fireEvent.click(getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(deleteMedia).toHaveBeenCalledTimes(1));
    expect(deleteMediaElement).toHaveBeenCalledTimes(1);
    expect(showSnackbar).toHaveBeenCalledTimes(1);
  });
});
