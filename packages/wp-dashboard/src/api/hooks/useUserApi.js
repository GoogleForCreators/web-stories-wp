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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { useConfig } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import {
  getUser,
  toggleWebStoriesTrackingOptIn as toggleWebStoriesTrackingOptInCallback,
  toggleWebStoriesMediaOptimization as toggleWebStoriesMediaOptimizationCallback,
} from '../user';

export default function useUserApi() {
  const [currentUser, setCurrentUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    api: { currentUser: currentUserApiPath },
  } = useConfig();

  useEffect(() => {
    if (!Object.keys(currentUser).length) {
      getUser(currentUserApiPath).then(setCurrentUser);
    }
  }, [currentUserApiPath, currentUser]);

  const toggleWebStoriesTrackingOptIn = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await toggleWebStoriesTrackingOptInCallback(
          currentUserApiPath,
          currentUser
        )
      );
    } finally {
      setIsUpdating(false);
    }
  }, [currentUserApiPath, currentUser]);

  const toggleWebStoriesMediaOptimization = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await toggleWebStoriesMediaOptimizationCallback(
          currentUserApiPath,
          currentUser
        )
      );
    } finally {
      setIsUpdating(false);
    }
  }, [currentUserApiPath, currentUser]);

  return {
    api: {
      toggleWebStoriesTrackingOptIn,
      toggleWebStoriesMediaOptimization,
    },
    currentUser: {
      data: currentUser,
      isUpdating,
    },
  };
}
