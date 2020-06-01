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
import MediaEditDialog from '../panes/media/mediaEditDialog';
import { renderWithTheme } from '../../../testUtils';
import ApiContext from '../../../app/api/context';
import MediaContext from '../../../app/media/context';
import SnackbarContext from '../../../app/snackbar/context';

const updateMedia = jest.fn();
const updateMediaElement = jest.fn();
const showSnackbar = jest.fn();

const resource = {
  type: 'image',
  mimeType: 'image/png',
  title: 'My Image :)',
  src: 'image-url',
  width: 910,
  height: 675,
  local: false,
  alt: 'my image alt text',
  sizes: {},
};

function setup() {
  updateMedia.mockReset();
  updateMediaElement.mockReset();
  showSnackbar.mockReset();

  const apiValue = {
    actions: {
      updateMedia,
    },
  };

  const mediaValue = {
    actions: {
      updateMediaElement,
    },
  };

  const snackbarValue = { showSnackbar };

  const { getByLabelText, getByRole, queryByText } = renderWithTheme(
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <MediaEditDialog resource={resource} onClose={() => {}} />
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
  return { getByLabelText, getByRole, queryByText };
}

describe('MediaEditDialog', () => {
  it('should render', () => {
    const { getByLabelText, getByRole, queryByText } = setup();

    expect(queryByText('Edit Image')).toBeInTheDocument();
    expect(queryByText('My Image :)')).toBeInTheDocument();
    expect(queryByText('910 x 675 pixels')).toBeInTheDocument();
    expect(getByLabelText('Alt text').value).toContain('my image alt text');
    expect(getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should update server and internal state with new alt text on save', async () => {
    const { getByLabelText, getByRole } = setup();

    // Mock out `updateMedia`.
    let serverAltText = resource.alt;
    updateMedia.mockImplementation((_id, update) => {
      serverAltText = update.alt_text;
    });

    // Mock out `updateMediaElement`.
    let stateAltText = resource.alt;
    updateMediaElement.mockImplementation((update) => {
      stateAltText = update.alt;
    });

    const input = getByLabelText('Alt text');
    fireEvent.change(input, { target: { value: 'new alt text' } });
    fireEvent.click(getByRole('button', { name: /save/i }));

    await waitFor(() => expect(updateMedia).toHaveBeenCalledTimes(1));
    expect(updateMediaElement).toHaveBeenCalledTimes(1);

    expect(serverAltText).toBe('new alt text');
    expect(stateAltText).toBe('new alt text');
  });

  it('should show snackbar if error on save to server', async () => {
    const { getByLabelText, getByRole } = setup();

    // Mock out `updateMedia`.
    let serverAltText = resource.alt;
    updateMedia.mockImplementation(() => {
      throw Error;
    });

    const input = getByLabelText('Alt text');
    fireEvent.change(input, { target: { value: 'new alt text' } });
    fireEvent.click(getByRole('button', { name: /save/i }));

    await waitFor(() => expect(updateMedia).toHaveBeenCalledTimes(1));
    expect(updateMediaElement).toHaveBeenCalledTimes(0);
    expect(showSnackbar).toHaveBeenCalledTimes(1);
    expect(serverAltText).toBe('my image alt text');
  });

  it('should show snackbar if error on save to state', async () => {
    const { getByLabelText, getByRole } = setup();

    // Mock out `updateMediaElement`.
    updateMediaElement.mockImplementation(() => {
      throw Error;
    });

    const input = getByLabelText('Alt text');
    fireEvent.change(input, { target: { value: 'new alt text' } });
    fireEvent.click(getByRole('button', { name: /save/i }));

    await waitFor(() => expect(updateMedia).toHaveBeenCalledTimes(1));
    expect(updateMediaElement).toHaveBeenCalledTimes(1);
    expect(showSnackbar).toHaveBeenCalledTimes(1);
  });
});
