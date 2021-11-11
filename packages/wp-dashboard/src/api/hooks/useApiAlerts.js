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
import { useEffect, useDebouncedCallback } from '@web-stories-wp/react';
import { useSnackbar } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { SUCCESS } from '../../constants';
import useEditorSettings from '../../components/editorSettings/useEditorSettings';

function useApiAlerts() {
  const { settingsError, mediaError, settingSaved, publisherLogosError } =
    useEditorSettings(
      ({
        state: {
          settings: { error: settingsError, settingSaved },
          media: { error: mediaError },
          publisherLogos: {
            error: publisherLogosError,
            settingSaved: publisherLogosSaved,
          },
        },
      }) => ({
        settingsError,
        mediaError,
        settingSaved: settingSaved || publisherLogosSaved,
        publisherLogosError,
      })
    );
  const { showSnackbar } = useSnackbar();

  const debouncedShowSnackbar = useDebouncedCallback((message) => {
    return showSnackbar({ message, dismissible: true });
  }, 200);

  // if there is an API error, display a snackbar
  useEffect(() => {
    if (settingsError?.id) {
      debouncedShowSnackbar(settingsError.message);
    }
  }, [settingsError, debouncedShowSnackbar]);

  useEffect(() => {
    if (settingSaved) {
      debouncedShowSnackbar(SUCCESS.SETTINGS.UPDATED);
    }
  }, [debouncedShowSnackbar, settingSaved]);

  useEffect(() => {
    if (mediaError?.id) {
      debouncedShowSnackbar(mediaError.message);
    }
  }, [mediaError, debouncedShowSnackbar]);

  useEffect(() => {
    if (publisherLogosError?.id) {
      debouncedShowSnackbar(publisherLogosError.message);
    }
  }, [publisherLogosError, debouncedShowSnackbar]);
}
export default useApiAlerts;
