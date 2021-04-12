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
import { fireEvent, waitFor } from '@testing-library/react';
import Modal from 'react-modal';

/**
 * Internal dependencies
 */
import CurrentUserContext from '../../../../../../app/currentUser/context';
import MediaContext from '../../../../../../app/media/context';
import VideoOptimizationDialog from '../videoOptimizationDialog';
import { renderWithTheme } from '../../../../../../testUtils';
import localStore, {
  LOCAL_STORAGE_PREFIX,
} from '../../../../../../utils/localStore';

const updateCurrentUser = jest.fn();
const storageKey = LOCAL_STORAGE_PREFIX.VIDEO_OPTIMIZATION_DIALOG_DISMISSED;

function setup() {
  updateCurrentUser.mockReset();
  const mediaValue = {
    local: {
      state: { isTranscoding: true },
    },
  };

  const userValue = {
    actions: { updateCurrentUser },
  };

  localStore.setItemByKey(storageKey, false);

  const result = renderWithTheme(
    <CurrentUserContext.Provider value={userValue}>
      <MediaContext.Provider value={mediaValue}>
        <VideoOptimizationDialog />
      </MediaContext.Provider>
    </CurrentUserContext.Provider>
  );

  const { container } = result;
  Modal.setAppElement(container);

  return result;
}

describe('videoOptimizationDialog', () => {
  it('should render', () => {
    const { queryByText, getByRole } = setup();

    expect(queryByText('Video optimization in progress')).toBeInTheDocument();
    expect(getByRole('button', { name: /Disable/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /Sounds/i })).toBeInTheDocument();
  });

  it('should trigger API request to update user when disabling', async () => {
    const { getByRole } = setup();

    fireEvent.click(getByRole('button', { name: /Disable/i }));

    await waitFor(() => expect(updateCurrentUser).toHaveBeenCalledTimes(1));
  });
});
