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
import type { Font, Page, Story } from '@googleforcreators/types';

export interface Capabilities {
  /** If the user has permissions to upload files. */
  hasUploadMediaAction?: boolean;
  /** If the user has permissions to manage site settings. */
  canManageSettings?: boolean;
}

export interface MimeTypes {
  audio?: string[];
  image?: string[];
  caption?: string[];
  vector?: string[];
  video?: string[];
}

export interface Locale {
  locale?: string;
  dateFormat?: string;
  timeFormat?: string;
  gmtOffset?: number;
  timeZone?: string;
  months?: string[];
  monthsShort?: string[];
  weekdays?: string[];
  weekdaysShort?: string[];
  weekdaysInitials?: string[];
  weekStartsOn?: number;
  timezoneAbbr?: string;
}

export interface MetaData {
  publisher?: string;
}

export interface API {
  users: string;
  currentUser: string;
  stories: string;
  pageTemplates: string;
  media: string;
  hotlink: string;
  publisherLogos: string;
  products: string;
  proxy: string;
  link: string;
  statusCheck: string;
  taxonomies: string;
  fonts: string;
  metaBoxes: string;
  storyLocking: string;
}

export interface MetaBoxes {
  normal: string[];
  advanced: string[];
  side: string[];
}

export interface Tip {
  title: string;
  figureSrcImg: string;
  figureAlt: string;
  description: string[];
  href: string;
}

interface PageTemplate extends Page {
  version: string;
}
interface TemplateData {
  story_data: PageTemplate;
  featured_media: number;
  title?: string;
}

type Term = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

type Author = {
  id: number;
  name: string;
  url?: string;
  description?: string;
  slug: string;
  link: string;
  avatarUrls?: Record<number, string>;
};

type User = {
  id: number;
  mediaOptimization: boolean;
  onboarding: Record<string, boolean>;
  trackingOptin: boolean;
};

type GetFontProps = {
  service?: string;
  include?: string;
  search?: string;
};

type HotlinkInfo = {
  ext?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  type?: string;
  width?: number;
  height?: number;
};

type LinkMetaData = {
  title: string;
  image: string;
};

export interface APICallbacks {
  addPageTemplate?: (data: TemplateData) => Promise<PageTemplate>;
  autoSaveById?: (story: Story) => Promise<Story>;
  createTaxonomyTerm?: (
    endpoint: string,
    term: {
      name: string;
      parent?: number;
      slug?: string;
    }
  ) => Promise<Term>;
  deleteMedia?: (id: number) => Promise<boolean>;
  deletePageTemplate?: (id: number) => Promise<boolean>;
  getAuthors?: () => Promise<Author[]>;
  getCurrentUser?: () => Promise<User>;
  getCustomPageTemplates?: (page: number | boolean) => Promise<{
    hasMore: boolean;
    templates: PageTemplate[];
  }>;
  getFonts?: (props: GetFontProps) => Promise<Font[]>;
  getHotlinkInfo?: (link: string) => Promise<HotlinkInfo>;
  getLinkMetadata?: (link: string) => Promise<LinkMetaData>;
  getMedia?: (props: {
    mediaType: string;
    searchTerm: string;
    pagingNum: number;
    // @todo Type properly.
  }) => Promise<{
    data: Record<string, unknown>;
    headers: Record<string, unknown>;
  }>;
  getMediaById?: unknown;
  getMediaForCorsCheck?: unknown;
  getMutedMediaById?: unknown;
  getOptimizedMediaById?: unknown;
  getPageTemplates?: unknown;
  getPosterMediaById?: unknown;
  getProducts?: unknown;
  getProxyUrl?: unknown;
  getStoryById?: unknown;
  getTaxonomies?: unknown;
  getTaxonomyTerm?: unknown;
  saveStoryById?: unknown;
  updateCurrentUser?: unknown;
  updateMedia?: unknown;
  updatePageTemplate?: unknown;
  uploadMedia?: unknown;
}

export interface PostLock {
  interval: number;
  showLockedDialog: boolean;
}

export interface ConfigState {
  /** Interval in seconds. */
  autoSaveInterval: number | null;
  /** Interval in seconds. */
  localAutoSaveInterval: number;
  autoSaveLink: string;
  isRTL: boolean;
  locale?: Locale;
  allowedMimeTypes: MimeTypes;
  storyId: number | null;
  dashboardLink: string;
  dashboardSettingsLink: string;
  generalSettingsLink: string;
  cdnURL: string;
  /** Max allowed upload in bytes */
  maxUpload: number;
  capabilities: Capabilities;
  metaData: MetaData;
  canViewDefaultTemplates: boolean;
  /** If to show the 3rd party media in the library */
  showMedia3p: boolean;
  encodeMarkup: boolean;
  ffmpegCoreUrl: string;
  apiCallbacks: APICallbacks;
  styleConstants: {
    topOffset: number;
    leftOffset: number;
  };
  /** Data for when a user tries to edit a story that's already being edited */
  postLock?: PostLock;
  postType?: string;
  revisionLink?: string;
  // @todo Is this used at all?
  isDemo?: boolean;
  api?: API;
  /** Plugin version */
  version: string;
  nonce?: string;
  /** If true, the story advances automatically */
  globalAutoAdvance?: boolean;
  /** Page duration in seconds in case of auto-advancing */
  globalPageDuration?: number;
  shoppingProvider: string;
  /** Enabled meta-boxes that are displayed in the editor */
  metaBoxes?: MetaBoxes;
  mediainfoUrl: string;
  /** Feature flags */
  flags: Record<string, boolean>;
  additionalTips: Record<string, Tip>;
}
