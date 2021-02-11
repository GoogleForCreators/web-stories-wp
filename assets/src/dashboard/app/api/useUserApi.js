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
import { useCallback, useMemo, useState } from 'react';

export default function useUserApi(dataAdapter, { currentUserApi }) {
  const [currentUser, setCurrentUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const fetchCurrentUser = useCallback(async () => {
    try {
      setCurrentUser(await dataAdapter.get(currentUserApi));
    } catch (e) {
      setCurrentUser({});
    }
  }, [dataAdapter, currentUserApi]);

  const toggleWebStoriesTrackingOptIn = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await dataAdapter.post(currentUserApi, {
          data: {
            meta: {
              web_stories_tracking_optin: !currentUser.meta
                .web_stories_tracking_optin,
            },
          },
        })
      );
    } finally {
      setIsUpdating(false);
    }
  }, [dataAdapter, currentUser, currentUserApi]);

  const toggleWebStoriesMediaOptimization = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await dataAdapter.post(currentUserApi, {
          data: {
            meta: {
              web_stories_media_optimization: !currentUser.meta
                .web_stories_media_optimization,
            },
          },
        })
      );
    } finally {
      setIsUpdating(false);
    }
  }, [dataAdapter, currentUser, currentUserApi]);

  return useMemo(
    () => ({
      api: {
        fetchCurrentUser,
        toggleWebStoriesTrackingOptIn,
        toggleWebStoriesMediaOptimization,
      },
      currentUser: { data: currentUser, isUpdating },
    }),
    [
      fetchCurrentUser,
      toggleWebStoriesTrackingOptIn,
      toggleWebStoriesMediaOptimization,
      currentUser,
      isUpdating,
    ]
  );
}
