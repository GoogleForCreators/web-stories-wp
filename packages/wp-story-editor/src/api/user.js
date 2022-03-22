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

function transformResponse(response) {
  return {
    id: response.id,
    trackingOptin: response.meta.web_stories_tracking_optin,
    onboarding: response.meta.web_stories_onboarding,
    mediaOptimization: response.meta.web_stories_media_optimization,
  };
}

export function getCurrentUser(config) {
  return apiFetch({
    path: config.api.currentUser,
  }).then(transformResponse);
}

export function updateCurrentUser(config, data) {
  const { trackingOptin, onboarding, mediaOptimization } = data;

  const wpKeysMapping = {
    meta: {
      web_stories_tracking_optin: trackingOptin,
      web_stories_onboarding: onboarding,
      web_stories_media_optimization: mediaOptimization,
    },
  };

  Object.entries(wpKeysMapping.meta).forEach(([key, value]) => {
    if (value === undefined) {
      delete wpKeysMapping.meta[key];
    }
  });

  return apiFetch({
    path: config.api.currentUser,
    method: 'POST',
    data: wpKeysMapping,
  }).then(transformResponse);
}
