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
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { APICallbacks } from './apiProvider';
import type { Flags } from './storyEditor';

export interface Capabilities {
  /** If the user has permissions to upload files. */
  hasUploadMediaAction?: boolean;
  /** If the user has permissions to manage site settings. */
  canManageSettings?: boolean;
}

interface MimeTypes {
  audio?: string[];
  image?: string[];
  caption?: string[];
  vector?: string[];
  video?: string[];
}

interface Locale {
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
  figureSrcImg?: string;
  figureAlt?: string;
  description: string[];
  href?: string;
}

export interface PageTemplate extends Page {
  version: string;
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
  flags: Flags;
  additionalTips: Record<string, Tip>;
}
