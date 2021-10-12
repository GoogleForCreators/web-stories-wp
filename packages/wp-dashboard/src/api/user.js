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
 * Get user.
 *
 * @param {Object} config Configuration object.
 * @return {Promise} Request promise.
 */
export function getUser(config) {
  return apiFetch({
    path: config.api.currentUser,
  });
}

/**
 * Toggle web stories media optimization on settings page.
 *
 * @param {Object} config Configuration object.
 * @param {string} currentUser Current user.
 * @return {Promise} Request promise.
 */
export function toggleWebStoriesMediaOptimization(config, currentUser) {
  return apiFetch({
    path: config.api.currentUser,
    data: {
      meta: {
        web_stories_media_optimization:
          !currentUser.meta.web_stories_media_optimization,
      },
    },
    method: 'POST',
  });
}

/**
 * Handles the toggle web stories tracking opt in on settings page.
 *
 * @param {Object} config Configuration object.
 * @param {Object} currentUser Current user object.
 * @return {Promise} Request promise.
 */
export function toggleWebStoriesTrackingOptIn(config, currentUser) {
  return apiFetch({
    path: config.api.currentUser,
    data: {
      meta: {
        web_stories_tracking_optin:
          !currentUser.meta.web_stories_tracking_optin,
      },
    },
    method: 'POST',
  });
}
