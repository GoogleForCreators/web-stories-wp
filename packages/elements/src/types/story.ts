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
import type { Pattern } from '@googleforcreators/patterns';
import type { AudioResource } from '@googleforcreators/media';

interface FeaturedMedia {
  id: number;
  height: number;
  width: number;
  url: string;
  needsProxy: boolean;
  isExternal: boolean;
}
interface PublisherLogo {
  id: number;
  height: number;
  width: number;
  url: string;
}

interface Author {
  id: number;
  name: string;
}
interface CurrentStyles {
  colors: Pattern[];
}
interface GlobalStyles {
  colors: Pattern[];
  textStyles: Partial<Text>;
}
export interface Story {
  storyId: number;
  title: string;
  author: Author;
  date: null | string;
  modified: string;
  excerpt: string;
  slug: string;
  link: string;
  extras: Record<string, unknown>;
  featuredMedia: FeaturedMedia;
  permalinkConfig: null | {
    prefix: string;
    suffix: string;
  };
  publisherLogo: PublisherLogo;
  previewLink: string;
  editLink: string;
  password: string;
  embedPostLink: string;
  revisions: {
    count: number;
  };
  currentStoryStyles: CurrentStyles;
  globalStoryStyles: GlobalStyles;
  taxonomies: string[];
  terms: string[];
  status: string;
  backgroundAudio?: {
    resource: AudioResource;
  };
  autoAdvance?: boolean;
  defaultPageDuration?: number;
}
