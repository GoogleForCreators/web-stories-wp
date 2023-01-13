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
import { addQueryArgs } from '@googleforcreators/url';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import type {
  WordPressSettings,
  Settings,
  AdNetworkType,
  ArchiveType,
  ShoppingProviderType,
  WordPressStoriesSettings,
} from '../types';

/**
 * Transform settings api response.
 *
 * @param response API response.
 * @return Transformed object.
 */
function transformSettingResponse(response: WordPressSettings): Settings {
  return {
    googleAnalyticsId: response.web_stories_ga_tracking_id,
    usingLegacyAnalytics: response.web_stories_using_legacy_analytics,
    adSensePublisherId: response.web_stories_adsense_publisher_id,
    adSenseSlotId: response.web_stories_adsense_slot_id,
    adManagerSlotId: response.web_stories_ad_manager_slot_id,
    adNetwork: response.web_stories_ad_network as AdNetworkType,
    videoCache: response.web_stories_video_cache,
    dataRemoval: response.web_stories_data_removal,
    archive: response.web_stories_archive as ArchiveType,
    archivePageId: response.web_stories_archive_page_id,
    shoppingProvider:
      response.web_stories_shopping_provider as ShoppingProviderType,
    shopifyHost: response.web_stories_shopify_host,
    shopifyAccessToken: response.web_stories_shopify_access_token,
  };
}

/**
 * Fetch settings.
 * Used on settings page.
 *
 * @param apiPath API path.
 * @return Request promise.
 */
export function fetchSettings(apiPath: string): Promise<Settings> {
  return apiFetch<WordPressSettings>({
    path: apiPath,
  }).then(transformSettingResponse);
}

/**
 * Update settings.
 *
 * @param apiPath API path.
 * @param queryParams Query parameters to apply to URL.
 * @return Request promise.
 */
export function updateSettings(
  apiPath: string,
  queryParams: Partial<Settings>
): Promise<Settings> {
  const {
    googleAnalyticsId,
    usingLegacyAnalytics,
    adSensePublisherId,
    adSenseSlotId,
    adManagerSlotId,
    adNetwork,
    videoCache,
    dataRemoval,
    archive,
    archivePageId,
    shoppingProvider,
    shopifyHost,
    shopifyAccessToken,
    autoAdvance,
    defaultPageDuration,
  } = queryParams;

  const query: Partial<WordPressStoriesSettings> = {};

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

  if (dataRemoval !== undefined) {
    query.web_stories_data_removal = Boolean(dataRemoval);
  }

  if (archive !== undefined) {
    query.web_stories_archive = archive;
  }

  if (archivePageId !== undefined) {
    query.web_stories_archive_page_id = archivePageId;
  }

  if (shoppingProvider !== undefined) {
    query.web_stories_shopping_provider = shoppingProvider;
  }

  if (shopifyHost !== undefined) {
    query.web_stories_shopify_host = shopifyHost;
  }

  if (shopifyAccessToken !== undefined) {
    query.web_stories_shopify_access_token = shopifyAccessToken;
  }

  if (autoAdvance !== undefined) {
    query.web_stories_auto_advance = Boolean(autoAdvance);
  }

  if (defaultPageDuration !== undefined) {
    query.web_stories_default_page_duration = defaultPageDuration;
  }

  const path = addQueryArgs(apiPath, query);

  return apiFetch<WordPressSettings>({
    path,
    method: 'POST',
  }).then((response) => transformSettingResponse(response));
}
