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

export interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface Config {
  capabilities: {
    canManageSettings: boolean;
    hasUploadMediaAction: boolean;
  };
  storyId: number;
  nonce: string;
  encodeMarkup: string;
  metaBoxes: object;
  postLock: {
    interval: number;
    showLockedDialog: boolean;
  };
  api: {
    currentUser: string;
    taxonomies: string;
    products: string;
    proxy: string;
    link: string;
    pageTemplates: string;
    fonts: string;
    users: string;
    hotlink: string;
    media: string;
    stories: string;
    storyLocking: string;
    statusCheck: string;
    metaBoxes: string;
  };
  postType: string;
  dashboardLink: string;
  dashboardSettingsLink: string;
  isRTL: boolean;
  allowedMimeTypes: {
    image: string[];
  };
  revisionLink: string;
}
