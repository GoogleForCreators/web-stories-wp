/*
 * Copyright 2020 Google LLC
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { migrate, DATA_VERSION } from '../../../migration/migrate';

// TODO: this is mostly placeholder to generally lend shape to saved templates that matches stories. We do no have stories formatted and returned in saved template API yet
export default function reshapeSavedTemplateObject(originalSavedTemplateData) {
  const {
    id,
    title,
    modified,
    status,
    date,
    link,
    story_data: storyData = {},
  } = originalSavedTemplateData;

  if (!Array.isArray(storyData?.pages) || !id || storyData.pages.length === 0) {
    storyData.pages = [
      {
        id: 'placeholder-id',
        animations: [],
        elements: [],
      },
    ];
    // the saved template API as it stands now does not bring back story page data.
    // We need this to exist for the page to render.
    // Normally if a story had no pages we'd just return null and move on, but i want to be able to test out the rest of the UI.
  }

  const updatedStoryData = {
    ...migrate(storyData, storyData.version),
    version: DATA_VERSION,
  };

  return {
    id,
    status,
    title: title,
    modified: modified,
    created: date,
    pages: updatedStoryData?.pages,
    author: __('Google', 'web-stories'),
    link,
    originalSavedTemplateData,
  };
}
