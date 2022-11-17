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
  MediaElement,
  Page,
  FontData,
  ProductData,
} from '@googleforcreators/elements';
import type {
  Resource,
  ResourceId,
  TrimData,
  VideoResource,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import type { RawStory, Story } from './storyProvider';

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

type UploadMediaProps = {
  onUploadSuccess?: (media: MediaElement) => void;
  onUploadProgress?: (media: MediaElement) => void;
  onUploadError?: (media: MediaElement) => void;
  cropVideo?: boolean;
  additionalData: {
    originalId?: number;
    mediaId?: number;
    storyId?: number;
    templateId?: number;
    optimizedId?: number;
    cropOriginId?: number;
    mutedId?: number;
    posterId?: number;
    isMuted?: boolean;
    mediaSource?: string;
    trimData?: TrimData;
    baseColor?: string;
    blurHash?: string;
    isGif?: boolean;
    altText?: string;
  };
  originalResourceId: ResourceId;
  resource: Resource;
};

export type Taxonomy = {
  name: string;
  slug: string;
  capabilities: Record<string, string>;
  description?: string;
  labels: Record<string, string>;
  types: string[];
  showCloud?: boolean;
  hierarchical: boolean;
  restBase: string;
  restNamespace: string;
  visibility: Record<string, boolean>;
  restPath: string;
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
  getFonts?: (props: GetFontProps) => Promise<FontData[]>;
  getHotlinkInfo?: (link: string) => Promise<HotlinkInfo>;
  getLinkMetadata?: (link: string) => Promise<LinkMetaData>;
  getMedia?: (props: {
    mediaType: string;
    searchTerm: string;
    pagingNum: number;
  }) => Promise<{
    data: Resource[];
    headers: Record<string, string>;
  }>;
  getMediaById?: (id: number) => Promise<Resource>;
  getMediaForCorsCheck?: () => Promise<Resource[]>;
  getMutedMediaById?: (id: number) => Promise<VideoResource>;
  getOptimizedMediaById?: (id: number) => Promise<Resource>;
  getPageTemplates?: () => Promise<PageTemplate[]>;
  getPosterMediaById?: (id: number) => Promise<Resource>;
  getProducts?: () => Promise<ProductData[]>;
  getProxyUrl?: (src: string) => string;
  getStoryById?: (id: number) => Promise<RawStory>;
  getTaxonomies?: () => Promise<Taxonomy[]>;
  getTaxonomyTerm?: (props: {
    search?: string;
    per_page?: number;
  }) => Promise<Term>;
  saveStoryById?: (data: Story) => Promise<Story>;
  updateCurrentUser?: (data: {
    mediaOptimization?: boolean;
    onboarding?: Record<string, boolean>;
    trackingOptin?: boolean;
  }) => Promise<User>;
  updateMedia?: (id: number, data: Partial<Resource>) => Promise<Resource>;
  updatePageTemplate?: (
    id: number,
    data: Partial<PageTemplate>
  ) => Promise<PageTemplate>;
  uploadMedia?: (files: string[], props: UploadMediaProps) => Promise<Resource>;
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
  metadata: MetaData;
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
  /** Plugin version */
  version: string;
  /** If true, the story advances automatically */
  globalAutoAdvance?: boolean;
  /** Page duration in seconds in case of auto-advancing */
  globalPageDuration?: number;
  shoppingProvider: string;
  mediainfoUrl: string;
  /** Feature flags */
  flags: Record<string, boolean>;
  additionalTips: Record<string, Tip>;
}
