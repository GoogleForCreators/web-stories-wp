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
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import { useConfig } from '../config';

export default function useUserApi(currentUserApi) {
  const [currentUser, setCurrentUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    apiCallbacks: {
      getUser,
      toggleWebStoriesTrackingOptIn: toggleWebStoriesTrackingOptInCallback,
      toggleWebStoriesMediaOptimization:
        toggleWebStoriesMediaOptimizationCallback,
    },
  } = useConfig();

  useEffect(() => {
    if (!Object.keys(currentUser).length) {
      getUser(currentUserApi).then(setCurrentUser);
    }
  }, [currentUser, currentUserApi, getUser]);

  const toggleWebStoriesTrackingOptIn = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await toggleWebStoriesTrackingOptInCallback(currentUser, currentUserApi)
      );
    } finally {
      setIsUpdating(false);
    }
  }, [toggleWebStoriesTrackingOptInCallback, currentUser, currentUserApi]);

  const toggleWebStoriesMediaOptimization = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await toggleWebStoriesMediaOptimizationCallback(
          currentUser,
          currentUserApi
        )
      );
    } finally {
      setIsUpdating(false);
    }
  }, [toggleWebStoriesMediaOptimizationCallback, currentUser, currentUserApi]);

  return useMemo(
    () => ({
      api: {
        toggleWebStoriesTrackingOptIn,
        toggleWebStoriesMediaOptimization,
      },
      currentUser: { data: currentUser, isUpdating },
    }),
    [
      toggleWebStoriesTrackingOptIn,
      toggleWebStoriesMediaOptimization,
      currentUser,
      isUpdating,
    ]
  );
}
