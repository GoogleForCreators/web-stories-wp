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
import { useEffect } from 'react';
import { useSnackbar } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useApi from './useApi';

function useApiAlerts() {
  const { storyError, templateError, settingsError, mediaError } = useApi(
    ({
      state: {
        stories: { error: storyError },
        templates: { error: templateError },
        settings: { error: settingsError },
        media: { error: mediaError },
      },
    }) => ({
      storyError,
      templateError,
      settingsError,
      mediaError,
    })
  );
  const { showSnackbar } = useSnackbar();

  // if there is an API error, display a snackbar
  useEffect(() => {
    if (storyError?.id) {
      showSnackbar({
        message: storyError.message,
        dismissable: true,
      });
    }
  }, [storyError, showSnackbar]);

  useEffect(() => {
    if (templateError?.id) {
      showSnackbar({
        message: templateError.message,
        dismissable: true,
      });
    }
  }, [templateError, showSnackbar]);

  useEffect(() => {
    if (settingsError?.id) {
      showSnackbar({
        message: settingsError.message,
        dismissable: true,
      });
    }
  }, [settingsError, showSnackbar]);

  useEffect(() => {
    if (mediaError?.id) {
      showSnackbar({
        message: mediaError.message,
        dismissable: true,
      });
    }
  }, [mediaError, showSnackbar]);
}
export default useApiAlerts;
