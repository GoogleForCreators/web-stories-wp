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
 * External dependencies
 */
import { DATA_VERSION } from '@googleforcreators/migration';

/**
 * Internal dependencies
 */
import {
  LOCAL_STORAGE_CONTENT_KEY,
  LOCAL_STORAGE_PREVIEW_MARKUP_KEY,
} from '../constants';

export const saveStoryById = ({
  pages,
  globalStoryStyles,
  autoAdvance,
  defaultPageDuration,
  currentStoryStyles,
  backgroundAudio,
  content,
  title,
  excerpt,
}) => {
  const storySaveData = {
    title: {
      raw: title,
    },
    excerpt: {
      raw: excerpt,
    },
    storyData: {
      version: DATA_VERSION,
      pages,
      autoAdvance,
      defaultPageDuration,
      currentStoryStyles,
      backgroundAudio,
    },
    author: {
      id: 1,
      name: '',
    },
    stylePresets: globalStoryStyles,
    permalinkTemplate: 'https://example.org/web-stories/%pagename%/',
  };

  window.localStorage.setItem(
    LOCAL_STORAGE_CONTENT_KEY,
    JSON.stringify(storySaveData)
  );
  window.localStorage.setItem(LOCAL_STORAGE_PREVIEW_MARKUP_KEY, content);

  return Promise.resolve({});
};
