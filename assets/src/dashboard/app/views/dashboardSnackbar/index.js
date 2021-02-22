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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { SnackbarContainer, useSnackbarContext } from '../../snackbar';
import useApi from '../../api/useApi';

function SnackbarView() {
  const { storyError, templateError, settingsError, mediaError } = useApi(
    ({
      state: {
        stories: { error: storyError },
        templates: { error: templateError },
        settings: { error: settingsError },
        media: { error: mediaError },
      },
    }) => ({ storyError, templateError, settingsError, mediaError })
  );

  const {
    actions: { removeSnackbarMessage, addSnackbarMessage },
    state: { activeSnackbarMessage },
  } = useSnackbarContext();

  useEffect(() => {
    if (storyError?.id) {
      addSnackbarMessage({
        message: storyError.message,
        id: storyError.id,
      });
    }
  }, [storyError, addSnackbarMessage]);

  useEffect(() => {
    if (templateError?.id) {
      addSnackbarMessage({
        message: templateError.message,
        id: templateError.id,
      });
    }
  }, [templateError, addSnackbarMessage]);

  useEffect(() => {
    if (settingsError?.id) {
      addSnackbarMessage({
        message: settingsError.message,
        id: settingsError.id,
      });
    }
  }, [settingsError, addSnackbarMessage]);

  useEffect(() => {
    if (mediaError?.id) {
      addSnackbarMessage({
        message: mediaError.message,
        id: mediaError.id,
      });
    }
  }, [mediaError, addSnackbarMessage]);

  return (
    <SnackbarContainer
      activeSnackbarMessage={activeSnackbarMessage}
      handleDismissMessage={removeSnackbarMessage}
    />
  );
}

export default SnackbarView;
