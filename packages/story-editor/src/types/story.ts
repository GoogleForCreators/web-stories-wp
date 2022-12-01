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
  Page,
  ProductData,
  StoryData,
  Story,
  TextElement,
} from '@googleforcreators/elements';
import type { Pattern } from '@googleforcreators/patterns';

interface FeaturedMedia {
  id: number;
  height: number;
  width: number;
  url: string;
  needsProxy: boolean;
  isExternal: boolean;
}

// Data required by API callbacks for saving a story.
export interface StorySaveData
  extends Pick<
    Story,
    | 'title'
    | 'status'
    | 'author'
    | 'date'
    | 'modified'
    | 'slug'
    | 'excerpt'
    | 'featuredMedia'
    | 'publisherLogo'
    | 'password'
    | 'currentStoryStyles'
    | 'globalStoryStyles'
    | 'autoAdvance'
    | 'defaultPageDuration'
    | 'backgroundAudio'
    | 'terms'
  > {
  storyId?: number;
  content: string;
  products: ProductData[];
  pages: Page[];
}

// Data that's returned from API after saving.
export interface StoryReturnData {
  slug: string;
  status: string;
  link: string;
  previewLink: string;
  editLink: string;
  embedPostLink: string;
  featuredMedia: FeaturedMedia;
  revisions: {
    count: number;
    id: number;
  };
}

// Raw story that comes to the provider from API callback.
export interface RawStory {
  id: number;
  date: string;
  modified: string;
  password: string;
  slug: string;
  status: string;
  link: string;
  title: {
    raw?: string;
    rendered?: string;
  };
  excerpt: {
    raw?: string;
    rendered?: string;
    protected?: boolean;
  };
  permalinkTemplate: string;
  storyData: StoryData;
  stylePresets: {
    colors?: Pattern[];
    textStyles?: Partial<TextElement>[];
  };
  previewLink: string;
  editLink: string;
  embedPostLink: string;
  author: {
    id: number;
    name: string;
  };
  capabilities: Record<string, boolean>;
  extras: Record<string, unknown>;
  featuredMedia: {
    id: number;
    height: number;
    width: number;
    url: string;
    needsProxy: boolean;
    isExternal: boolean;
  };
  publisherLogo: {
    id: number;
    height: number;
    width: number;
    url: string;
  };
  taxonomies: string[];
  revisions: {
    count: number;
  };
  terms: string[];
}
