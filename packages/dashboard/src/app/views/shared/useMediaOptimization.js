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
import { useCallback, useEffect, useRef } from 'react';
import { trackEvent } from '@web-stories-wp/tracking';
import { useSnackbar } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useApi from '../../api/useApi';
import { SUCCESS } from '../../textContent';

export default function useMediaOptimization() {
  const { showSnackbar } = useSnackbar();

  const { currentUser, toggleWebStoriesMediaOptimization, fetchCurrentUser } =
    useApi(
      ({
        state: { currentUser },
        actions: {
          usersApi: { toggleWebStoriesMediaOptimization, fetchCurrentUser },
        },
      }) => ({
        currentUser,
        toggleWebStoriesMediaOptimization,
        fetchCurrentUser,
      })
    );

  const dataIsLoaded =
    currentUser.data.meta?.web_stories_media_optimization !== undefined;

  const mediaOptimization = Boolean(
    currentUser.data.meta?.web_stories_media_optimization
  );

  const dataFetched = useRef(false);

  useEffect(() => {
    if (!dataIsLoaded && !dataFetched.current) {
      fetchCurrentUser();
      dataFetched.current = true;
    }
  }, [dataIsLoaded, fetchCurrentUser]);

  const _toggleWebStoriesMediaOptimization = useCallback(() => {
    toggleWebStoriesMediaOptimization();
    trackEvent('video_optimization_optin', {
      status: mediaOptimization ? 'off' : 'on',
    });
    showSnackbar({ message: SUCCESS.SETTINGS.UPDATED, dismissable: true });
  }, [mediaOptimization, showSnackbar, toggleWebStoriesMediaOptimization]);

  return {
    mediaOptimization,
    disabled: currentUser.isUpdating,
    toggleWebStoriesMediaOptimization: _toggleWebStoriesMediaOptimization,
  };
}
