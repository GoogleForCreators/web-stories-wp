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
import { useEffect, useDebouncedCallback } from '@googleforcreators/react';
import { useSnackbar } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import useApi from './useApi';

function useApiAlerts() {
  const { storyError, templateError } = useApi(
    ({
      state: {
        stories: { error: storyError },
        templates: { error: templateError },
      },
    }) => ({
      storyError,
      templateError,
    })
  );
  const { showSnackbar } = useSnackbar();

  const debouncedShowSnackbar = useDebouncedCallback((message) => {
    return showSnackbar({ message, dismissible: true });
  }, 200);
  // if there is an API error, display a snackbar
  useEffect(() => {
    if (storyError?.id) {
      debouncedShowSnackbar(storyError.message);
    }
  }, [storyError, debouncedShowSnackbar]);

  useEffect(() => {
    if (templateError?.id) {
      debouncedShowSnackbar(templateError.message);
    }
  }, [templateError, debouncedShowSnackbar]);
}
export default useApiAlerts;
