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
 * Internal dependencies
 */
import type { BackgroundAudioResource } from '../resource';
import type { Page } from './page';

export interface FeaturedMedia {
  height: number;
  id: number;
  isExternal: boolean;
  needsProxy: boolean;
  url: string;
  width: number;
}
export interface PublisherLogo {
  height: number;
  id: number;
  url: string;
  width: number;
}
export interface StoryMetaData {
  featuredMedia: FeaturedMedia;
  link: string;
  title: string;
  autoAdvance: boolean;
  defaultPageDuration: number;
  backgroundAudio?: Record<string, BackgroundAudioResource>;
  publisherLogo: PublisherLogo;
}

export type Flags = Record<string, boolean>;
export interface Story {
  version: number;
  pages: Page[];
  backgroundAudio?: {
    resource: {
      src: string;
      id: number;
      mimeType: string;
    };
  };
}
