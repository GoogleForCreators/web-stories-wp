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

export interface ApiCallbacks {
  createStoryFromTemplate?: void;
  duplicateStory?: void;
  fetchStories?: void;
  getAuthors?: void;
  getProducts?: void;
  getTaxonomies?: void;
  getTaxonomyTerms?: void;
  trashStory?: void;
  updateStory?: void;
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
