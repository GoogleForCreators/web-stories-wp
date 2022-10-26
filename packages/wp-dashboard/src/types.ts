/*
 * Copyright 2022 Google LLC
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
import type {
  WP_REST_API_Settings,
  WP_REST_API_User,
  WP_REST_API_Attachment,
  WP_REST_API_Post,
  WP_REST_API_Object_Links,
  WP_REST_API_Taxonomy,
  WP_REST_API_Envelope,
} from 'wp-types';
import type { DashboardConfig } from '@googleforcreators/dashboard';

export interface WPDashboardConfig extends DashboardConfig {
  allowedImageMimeTypes: string[];
  canViewDefaultTemplates: boolean;
  siteKitStatus: {
    installed: boolean;
    active: boolean;
    analyticActive: boolean;
    link: string;
  };
  maxUpload: number;
  maxUploadFormatted: string;
  archiveURL: string;
  defaultArchiveURL: string;
  api: {
    stories: string;
    media: string;
    currentUser: string;
    fonts: string;
    users: string;
    settings: string;
    pages: string;
    publisherLogos: string;
    taxonomies: string;
    products: string;
  };
  flags: {
    [key: string]: boolean;
  };
  vendors: {
    [key: string]: string;
  };
}

export type WordPressUser = WP_REST_API_User;

export interface WordPressLock {
  locked: boolean;
}

export type WordPressLockUser = WordPressUser;

export enum WordPressLinkTypes {
  Edit = 'wp:action-edit',
  Delete = 'wp:action-delete',
  Items = 'wp:items',
}

export interface WordPressLinks extends WP_REST_API_Object_Links {
  [WordPressLinkTypes.Edit]: {
    href: string;
    embeddable?: boolean;
  }[];
  [WordPressLinkTypes.Delete]: {
    href: string;
    embeddable?: boolean;
  }[];
  [WordPressLinkTypes.Items]: {
    href: string;
    embeddable?: boolean;
  }[];
}

export interface WordPressStoryPoster {
  id: number;
  needsProxy: boolean;
  width: number;
  height: number;
  url: string;
}

export type WordPressTaxonomy = WP_REST_API_Taxonomy;

export interface Taxonomy {
  restPath: string;
}

export interface WordPressStory extends WP_REST_API_Post {
  preview_link: string;
  edit_link: string;
  story_poster: WordPressStoryPoster;
  _embedded: {
    author: WordPressUser[];
    'wp:lock': WordPressLock;
    'wp:lockuser': WordPressLockUser[];
  };
  _links: WordPressLinks;
}

export interface EnvelopedWordPressStories
  extends WP_REST_API_Envelope<WordPressStory[]> {
  headers: {
    'X-WP-TotalPages': string;
    'X-WP-TotalByStatus': string;
  };
}

export interface WordPressRestAuthor {
  id: number;
  name: string;
}

export type WordPressPage = WP_REST_API_Post;

export interface Page {
  id: number;
  title: {
    raw?: string;
    rendered: string;
  };
}

export interface WordPressFont {
  id: number;
  family: string;
  url: string;
}

export interface WordPressMedia
  extends Omit<
    WP_REST_API_Attachment,
    'permalink_template' | 'generated_slug' | 'description'
  > {
  id: number;
  original_id: number;
}

export interface WordPressStoriesSettings {
  web_stories_ga_tracking_id: string;
  web_stories_using_legacy_analytics: boolean;
  web_stories_adsense_publisher_id: string;
  web_stories_adsense_slot_id: string;
  web_stories_ad_manager_slot_id: string;
  web_stories_ad_network: string;
  web_stories_video_cache: boolean;
  web_stories_archive: string;
  web_stories_data_removal: boolean;
  web_stories_archive_page_id: number;
  web_stories_shopping_provider: string;
  web_stories_shopify_host: string;
  web_stories_shopify_access_token: string;
}

export type WordPressSettings = WP_REST_API_Settings & WordPressStoriesSettings;

export interface Settings {
  googleAnalyticsId: string;
  usingLegacyAnalytics: boolean;
  adSensePublisherId: string;
  adSenseSlotId: string;
  adManagerSlotId: string;
  adNetwork: AdNetworkType;
  videoCache: boolean;
  dataRemoval: boolean;
  archive: ArchiveType;
  archivePageId: number;
  shoppingProvider: ShoppingProviderType;
  shopifyHost: string;
  shopifyAccessToken: string;
}

export enum AdNetworkType {
  None = 'none',
  Adsense = 'adsense',
  Admanager = 'admanager',
}

export enum ArchiveType {
  Default = 'default',
  Disabled = 'disabled',
  Custom = 'custom',
}

export enum ShoppingProviderType {
  None = 'none',
  Woocommerce = 'woocommerce',
  Shopify = 'shopify',
}

export type PublisherLogoId = number;

export interface PublisherLogo {
  id: PublisherLogoId;
  title: string;
  url: string;
  active: boolean;
}
