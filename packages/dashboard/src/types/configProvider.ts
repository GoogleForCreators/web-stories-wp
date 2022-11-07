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
import type { Template } from '@googleforcreators/templates';
import type { Product } from '@googleforcreators/types';

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

export interface Capabilities {
  canManageSettings?: boolean;
  canUploadFiles?: boolean;
}

export interface Navigation {
  value: string;
  label: string;
  isExternal?: boolean;
  trackingEvent?: string;
}

export interface StyleConstants {
  topOffset: number;
  leftOffset: number;
}

export interface QueryParams {
  page: number;
  perPage: number;
  filters: Record<string, string>;
  sort: Record<string, string>;
}

export interface Author {
  id: number;
  name: string;
}

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

interface TaxonomiesArgs {
  hierarchical?: boolean;
  show_ui?: boolean;
}

interface TermArgs {
  search?: string;
  per_page?: number;
}

interface Term {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface ApiCallbacks {
  createStoryFromTemplate?: (template: Template) => Promise<DashboardStory>;
  duplicateStory?: (story: DashboardStory) => Promise<DashboardStory>;
  fetchStories?: () => Promise<DashboardStory[]>;
  getAuthors?: (search: string) => Promise<Author[]>;
  getProducts?: (search: string) => Promise<Product[]>;
  getTaxonomies?: (args: TaxonomiesArgs) => Promise<Taxonomy[]>;
  getTaxonomyTerms?: (endpoint: string, args: TermArgs) => Promise<Term>;
  trashStory?: (id: number) => Promise<DashboardStory>;
  updateStory?: (
    story: Pick<DashboardStory, 'id' | 'author' | 'title'>
  ) => Promise<DashboardStory>;
}

interface LockUser {
  name?: string;
  id?: number;
  avatar?: string | null;
}

export interface DashboardStory {
  id: number;
  status: string;
  title: string;
  created: string;
  createdGmt: string;
  modified: string;
  modifiedGmt: string;
  author: Author;
  locked: boolean;
  lockUser: LockUser;
  bottomTargetAction: string;
  editStoryLink: string;
  previewLink: string;
  link: string;
  capabilities: Record<string, boolean>;
}

export interface DashboardConfig {
  isRTL: boolean;
  userId: number;
  locale: Locale;
  newStoryURL: string;
  cdnURL: string;
  version: string;
  capabilities: Capabilities;
  canViewDefaultTemplates: boolean;
  flags: Record<string, boolean>;
  apiCallbacks: ApiCallbacks;
  leftRailSecondaryNavigation: Navigation[];
  styleConstants: StyleConstants;
  globalAutoAdvance?: boolean;
  globalPageDuration?: number;
  documentTitleSuffix?: string;
  containerId: string;
}
