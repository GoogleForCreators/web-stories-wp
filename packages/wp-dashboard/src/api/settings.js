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
import { addQueryArgs } from '@web-stories-wp/design-system';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Transform settings api response.
 *
 * @param {Object} response API response.
 * @return {Object} Transformed object.
 */
const transformSettingResponse = (response) => ({
  googleAnalyticsId: response.web_stories_ga_tracking_id,
  usingLegacyAnalytics: response.web_stories_using_legacy_analytics,
  adSensePublisherId: response.web_stories_adsense_publisher_id,
  adSenseSlotId: response.web_stories_adsense_slot_id,
  adManagerSlotId: response.web_stories_ad_manager_slot_id,
  adNetwork: response.web_stories_ad_network,
  videoCache: response.web_stories_video_cache,
  archive: response.web_stories_archive,
  archivePageId: response.web_stories_archive_page_id,
});

/**
 * Fetch settings.
 * Used on settings page.
 *
 * @param {Object} config Configuration object.
 * @return {Promise} Request promise.
 */
export function fetchSettings(config) {
  return apiFetch({
    path: config.api.settings,
  }).then(transformSettingResponse);
}

/**
 * Update settings.
 *
 * @param {Object} config Configuration object.
 * @param {Object} queryParams Query parameters to apply to URL.
 * @return {Promise} Request promise.
 */
export function updateSettings(config, queryParams) {
  const {
    googleAnalyticsId,
    usingLegacyAnalytics,
    adSensePublisherId,
    adSenseSlotId,
    adManagerSlotId,
    adNetwork,
    videoCache,
    archive,
    archivePageId,
  } = queryParams;

  const query = {};

  if (googleAnalyticsId !== undefined) {
    query.web_stories_ga_tracking_id = googleAnalyticsId;
  }

  if (usingLegacyAnalytics !== undefined) {
    query.web_stories_using_legacy_analytics = usingLegacyAnalytics;
  }

  if (adSensePublisherId !== undefined) {
    query.web_stories_adsense_publisher_id = adSensePublisherId;
  }

  if (adSenseSlotId !== undefined) {
    query.web_stories_adsense_slot_id = adSenseSlotId;
  }

  if (adManagerSlotId !== undefined) {
    query.web_stories_ad_manager_slot_id = adManagerSlotId;
  }

  if (adNetwork !== undefined) {
    query.web_stories_ad_network = adNetwork;
  }

  if (videoCache !== undefined) {
    query.web_stories_video_cache = Boolean(videoCache);
  }

  if (archive !== undefined) {
    query.web_stories_archive = archive;
  }

  if (archivePageId !== undefined) {
    query.web_stories_archive_page_id = archivePageId;
  }

  const path = addQueryArgs(config.api.settings, query);

  return apiFetch({
    path,
    method: 'POST',
  }).then(transformSettingResponse);
}
