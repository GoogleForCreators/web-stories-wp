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
import { useCallback, useState, useEffect } from '@googleforcreators/react';
import { enableTracking, disableTracking } from '@googleforcreators/tracking';
import { useSnackbar, localStore } from '@googleforcreators/design-system';
import { useRouteHistory } from '@googleforcreators/dashboard';
/**
 * Internal dependencies
 */
import useEditorSettings from '../components/editorSettings/useEditorSettings';

/**
 * Internal dependencies
 */
import { SUCCESS, EDITOR_SETTINGS_ROUTE } from '../constants';

// The value associated with this key indicates if the user has interacted with
// the banner previously. If they have, we do not show the banner again.
const LOCAL_STORAGE_KEY = 'web_stories_tracking_optin_banner_closed';

function setInitialBannerPreviouslyClosed() {
  const storageValue = localStorage.getItem(LOCAL_STORAGE_KEY);

  return Boolean(JSON.parse(storageValue));
}

export default function useTelemetryOptIn() {
  const { showSnackbar } = useSnackbar();

  const [bannerPreviouslyClosed, setBannerPreviouslyClosed] = useState(
    setInitialBannerPreviouslyClosed
  );
  const [optInCheckboxClicked, setOptInCheckboxClicked] = useState(false);
  const { currentUser, toggleWebStoriesTrackingOptIn } = useEditorSettings(
    ({
      state: { currentUser },
      actions: {
        usersApi: { toggleWebStoriesTrackingOptIn },
      },
    }) => ({ currentUser, toggleWebStoriesTrackingOptIn })
  );
  const { currentPath } = useRouteHistory(({ state: { currentPath } }) => ({
    currentPath,
  }));

  const dataIsLoaded =
    currentUser.data.meta?.webStoriesTrackingOptin !== undefined;

  const optedIn = Boolean(currentUser.data.meta?.webStoriesTrackingOptin);

  useEffect(() => {
    if (optedIn) {
      enableTracking();
    } else {
      disableTracking();
    }
  }, [optedIn]);

  const _toggleWebStoriesTrackingOptIn = useCallback(() => {
    toggleWebStoriesTrackingOptIn();
    localStore.setItemByKey(LOCAL_STORAGE_KEY, true);
    setOptInCheckboxClicked(true);
    showSnackbar({
      'aria-label': SUCCESS.SETTINGS.UPDATED,
      message: SUCCESS.SETTINGS.UPDATED,
      dismissible: true,
    });
  }, [showSnackbar, toggleWebStoriesTrackingOptIn]);

  const closeBanner = useCallback(() => {
    setBannerPreviouslyClosed(true);
    localStore.setItemByKey(LOCAL_STORAGE_KEY, true);
  }, []);

  let bannerVisible = true;

  if (
    bannerPreviouslyClosed || // The banner has been closed before
    currentPath === EDITOR_SETTINGS_ROUTE || // The user is on the settings page
    !dataIsLoaded || // currentUser is not loaded yet
    (!optInCheckboxClicked && optedIn) // currentUser is loaded and optedIn is true but the user has not checked the opt in checkbox
  ) {
    bannerVisible = false;
  }

  return {
    bannerVisible,
    optedIn,
    disabled: currentUser.isUpdating,
    closeBanner,
    toggleWebStoriesTrackingOptIn: _toggleWebStoriesTrackingOptIn,
  };
}
