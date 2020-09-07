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
import { useCallback, useState, useEffect } from 'react';

/**
 * Internal dependencies
 */
import useApi from '../../api/useApi';
import { useRouteHistory } from '../../router';
import { APP_ROUTES } from '../../../constants';

// The value associated with this key indicates if the user has interacted with
// the banner previously. If they have, we do not show the banner again.
const LOCAL_STORAGE_KEY = `web_stories_tracking_optin_banner_visible`;

function setInitialBannerVisibility() {
  const storageValue = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (storageValue === null) {
    return true;
  }

  return JSON.parse(storageValue);
}

export default function useTelemetryOptIn() {
  const [_bannerVisible, setBannerVisibility] = useState(
    setInitialBannerVisibility
  );
  const {
    currentUser,
    toggleWebStoriesTrackingOptIn,
    fetchCurrentUser,
  } = useApi(
    ({
      state: { currentUser },
      actions: {
        usersApi: { toggleWebStoriesTrackingOptIn, fetchCurrentUser },
      },
    }) => ({ currentUser, toggleWebStoriesTrackingOptIn, fetchCurrentUser })
  );
  const [optedIn, setOptedIn] = useState(
    Boolean(currentUser.data.meta?.web_stories_tracking_optin)
  );
  const { currentPath } = useRouteHistory(({ state: { currentPath } }) => ({
    currentPath,
  }));

  useEffect(() => {
    setOptedIn(Boolean(currentUser.data.meta?.web_stories_tracking_optin));
  }, [currentUser]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser, currentPath]);

  const dataIsLoaded =
    currentUser.data.meta?.web_stories_tracking_optin !== undefined;

  const _toggleWebStoriesTrackingOptIn = useCallback(() => {
    toggleWebStoriesTrackingOptIn();
    setBannerVisibility(false);
  }, [toggleWebStoriesTrackingOptIn]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, _bannerVisible);
  }, [_bannerVisible]);

  const bannerVisible =
    dataIsLoaded &&
    !optedIn &&
    _bannerVisible &&
    currentPath !== APP_ROUTES.EDITOR_SETTINGS;

  return {
    bannerVisible,
    setBannerVisibility,
    optedIn,
    disabled: currentUser.isUpdating,
    toggleWebStoriesTrackingOptIn: _toggleWebStoriesTrackingOptIn,
  };
}
