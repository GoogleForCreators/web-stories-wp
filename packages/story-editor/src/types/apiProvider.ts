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
import type { FontData, ProductData } from '@googleforcreators/elements';
import type {
  Resource,
  ResourceId,
  TrimData,
  VideoResource,
} from '@googleforcreators/media';
import type { Template } from '@googleforcreators/templates';

/**
 * Internal dependencies
 */
import type { Taxonomy, Term } from './taxonomyProvider';
import type { RawStory, StoryReturnData, StorySaveData } from './story';
import type { PageTemplate } from './configProvider';
import type { User } from './storyEditor';

interface TemplateData {
  story_data: PageTemplate;
  featured_media: number;
  title?: string;
}

type Author = {
  id: number;
  name: string;
  url?: string;
  description?: string;
  slug: string;
  link: string;
  avatarUrls?: Record<number, string>;
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
  originalId?: ResourceId;
  mediaId?: number;
  storyId?: number | null;
  templateId?: number;
  optimizedId?: ResourceId;
  cropOriginId?: ResourceId;
  mutedId?: ResourceId;
  posterId?: ResourceId;
  isMuted?: boolean;
  mediaSource?: string;
  trimData?: TrimData;
  baseColor?: string;
  blurHash?: string;
  isGif?: boolean;
  altText?: string;
};

type UpdateMediaProps = {
  storyId?: number | null;
  optimizedId?: ResourceId;
  cropOriginId?: ResourceId;
  mutedId?: number;
  posterId?: ResourceId;
  isMuted?: boolean;
  mediaSource?: string;
  baseColor?: string;
  blurHash?: string;
  altText?: string;
};
export interface APICallbacks {
  addPageTemplate?: (data: TemplateData) => Promise<PageTemplate>;
  autoSaveById?: (story: StorySaveData) => Promise<StoryReturnData>;
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
  getAuthors?: (search_term: string) => Promise<Author[]>;
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
  getMutedMediaById?: (id: ResourceId) => Promise<VideoResource>;
  getOptimizedMediaById?: (id: ResourceId) => Promise<Resource>;
  getPageTemplates?: () => Promise<Template[]>;
  getPosterMediaById?: (id: ResourceId) => Promise<Resource>;
  getProducts?: () => Promise<ProductData[]>;
  getProxyUrl?: (src: string) => string;
  getStoryById?: (id: number) => Promise<RawStory>;
  getTaxonomies?: () => Promise<Taxonomy[]>;
  getTaxonomyTerm?: (
    termsEndpoint: string,
    props: {
      search?: string;
      per_page?: number;
    }
  ) => Promise<Term[] | []>;
  saveStoryById?: (data: StorySaveData) => Promise<StoryReturnData>;
  updateCurrentUser?: (data: Partial<User>) => Promise<User>;
  updateMedia?: (id: ResourceId, data: UpdateMediaProps) => Promise<Resource>;
  updatePageTemplate?: (
    id: number,
    data: Partial<PageTemplate>
  ) => Promise<PageTemplate>;
  uploadMedia?: (file: File, props: UploadMediaProps) => Promise<Resource>;
}

export interface APIState {
  actions: APICallbacks;
}
