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
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * Get user.
 *
 * @param {string} apiPath API path.
 * @return {Promise} Request promise.
 */
export function getUser(apiPath) {
  return apiFetch({
    path: apiPath,
  }).then(snakeToCamelCaseObjectKeys);
}

/**
 * Toggle web stories media optimization on settings page.
 *
 * @param {string} apiPath API path.
 * @param {Object} currentUser Current user.
 * @return {Promise} Request promise.
 */
export function toggleWebStoriesMediaOptimization(apiPath, currentUser) {
  return apiFetch({
    path: apiPath,
    data: {
      meta: {
        web_stories_media_optimization:
          !currentUser.meta.webStoriesMediaOptimization,
      },
    },
    method: 'POST',
  }).then(snakeToCamelCaseObjectKeys);
}

/**
 * Handles the toggle web stories tracking opt in on settings page.
 *
 * @param {string} apiPath API path.
 * @param {Object} currentUser Current user object.
 * @return {Promise} Request promise.
 */
export function toggleWebStoriesTrackingOptIn(apiPath, currentUser) {
  return apiFetch({
    path: apiPath,
    data: {
      meta: {
        web_stories_tracking_optin: !currentUser.meta.webStoriesTrackingOptin,
      },
    },
    method: 'POST',
  }).then(snakeToCamelCaseObjectKeys);
}
