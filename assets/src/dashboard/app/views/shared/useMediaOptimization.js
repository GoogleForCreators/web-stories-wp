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
import { useCallback, useState, useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import useApi from '../../api/useApi';
import { useRouteHistory } from '../../router';
import { APP_ROUTES } from '../../../constants';
import localStore from '../../../../edit-story/utils/localStore';

// The value associated with this key indicates if the user has interacted with
// the banner previously. If they have, we do not show the banner again.
const LOCAL_STORAGE_KEY = 'web_stories_media_optimization_banner_closed';

function setInitialBannerPreviouslyClosed() {
  const storageValue = localStorage.getItem(LOCAL_STORAGE_KEY);

  return Boolean(JSON.parse(storageValue));
}

export default function useMediaOptimization() {
  const [bannerPreviouslyClosed, setBannerPreviouslyClosed] = useState(
    setInitialBannerPreviouslyClosed
  );
  const [
    mediaOptimizationCheckboxClicked,
    setMediaOptimizationCheckboxClicked,
  ] = useState(false);
  const {
    currentUser,
    toggleWebStoriesMediaOptimization,
    fetchCurrentUser,
  } = useApi(
    ({
      state: { currentUser },
      actions: {
        usersApi: { toggleWebStoriesMediaOptimization, fetchCurrentUser },
      },
    }) => ({ currentUser, toggleWebStoriesMediaOptimization, fetchCurrentUser })
  );
  const { currentPath } = useRouteHistory(({ state: { currentPath } }) => ({
    currentPath,
  }));

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
    localStore.setItemByKey(LOCAL_STORAGE_KEY, true);
    setMediaOptimizationCheckboxClicked(true);
  }, [toggleWebStoriesMediaOptimization]);

  const closeBanner = useCallback(() => {
    setBannerPreviouslyClosed(true);
    localStore.setItemByKey(LOCAL_STORAGE_KEY, true);
  }, []);

  let bannerVisible = true;

  if (
    bannerPreviouslyClosed || // The banner has been closed before
    currentPath === APP_ROUTES.EDITOR_SETTINGS || // The user is on the settings page
    !dataIsLoaded || // currentUser is not loaded yet
    (!mediaOptimizationCheckboxClicked && mediaOptimization) // currentUser is loaded and mediaOptimization is true but the user has not checked the opt in checkbox
  ) {
    bannerVisible = false;
  }

  return {
    bannerVisible,
    mediaOptimization,
    disabled: currentUser.isUpdating,
    closeBanner,
    toggleWebStoriesMediaOptimization: _toggleWebStoriesMediaOptimization,
  };
}
