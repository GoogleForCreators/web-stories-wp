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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { SnakeOrCamelCaseObject, snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

interface WordPressUser {
  meta: {
    web_stories_media_optimization: boolean;
    web_stories_tracking_optin: boolean;
  };
}

export interface User {
  meta: {
    webStoriesMediaOptimization: boolean;
    webStoriesTrackingOptin: boolean;
  };
}

/**
 * Get user.
 *
 * @param apiPath API path.
 * @return Request promise.
 */
export function getUser(apiPath: string): Promise<User> {
  return apiFetch<WordPressUser>({
    path: apiPath,
  }).then(
    (response) => snakeToCamelCaseObjectKeys(response) as unknown as User
  );
}

/**
 * Toggle web stories media optimization on settings page.
 *
 * @param apiPath API path.
 * @param currentUser Current user.
 * @return Request promise.
 */
export function toggleWebStoriesMediaOptimization(
  apiPath: string,
  currentUser: User
): Promise<User> {
  return apiFetch<WordPressUser>({
    path: apiPath,
    data: {
      meta: {
        web_stories_media_optimization:
          !currentUser.meta.webStoriesMediaOptimization,
      },
    },
    method: 'POST',
  }).then(
    (response) => snakeToCamelCaseObjectKeys(response) as unknown as User
  );
}

/**
 * Handles the toggle web stories tracking opt in on settings page.
 *
 * @param apiPath API path.
 * @param currentUser Current user object.
 * @return Request promise.
 */
export function toggleWebStoriesTrackingOptIn(
  apiPath: string,
  currentUser: User
): Promise<User> {
  return apiFetch<WordPressUser>({
    path: apiPath,
    data: {
      meta: {
        web_stories_tracking_optin: !currentUser.meta.webStoriesTrackingOptin,
      },
    },
    method: 'POST',
  }).then(
    (response) =>
      snakeToCamelCaseObjectKeys(
        response as unknown as SnakeOrCamelCaseObject
      ) as unknown as User
  );
}
