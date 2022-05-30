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
 * External dependencies
 */
import { useEffect } from '@googleforcreators/react';
import { migrate } from '@googleforcreators/migration';
import { createPage } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useHistory } from '../../history';
import getUniquePresets from '../../../utils/getUniquePresets';

function loadStory(storyId, post, restore, clearHistory) {
  const {
    title: { raw: title = '' } = {},
    status,
    slug,
    date,
    modified,
    excerpt: { raw: excerpt = '' } = {},
    link,
    storyData: storyDataRaw,
    permalinkTemplate,
    stylePresets: globalStoryStyles = {},
    password,
    previewLink,
    editLink,
    embedPostLink,
    author,
    capabilities = {
      publish: false,
      'assign-author': false,
    },
    extras = {},
    featuredMedia,
    publisherLogo,
    taxonomies,
    terms,
  } = post;

  const [prefix, suffix] = permalinkTemplate
    ? permalinkTemplate.split(/%(?:postname|pagename)%/)
    : [];
  // If either of these is undefined, the placeholder was not found in settings.
  const foundSettings = prefix !== undefined && suffix !== undefined;
  const permalinkConfig = foundSettings
    ? {
        prefix,
        suffix,
      }
    : null;
  const statusFormat = status === 'auto-draft' ? 'draft' : status;

  // First clear history completely.
  clearHistory();

  // If there are no pages, create empty page.
  const storyData =
    storyDataRaw && migrate(storyDataRaw, storyDataRaw.version || 0);
  const pages = storyData?.pages?.length > 0 ? storyData.pages : [createPage()];

  // Initialize color/style presets, if missing.
  // Otherwise ensure the saved presets are unique.
  const newGlobalStoryStyles = {
    colors: globalStoryStyles.colors
      ? getUniquePresets(globalStoryStyles.colors)
      : [],
    textStyles: globalStoryStyles.textStyles
      ? getUniquePresets(globalStoryStyles.textStyles)
      : [],
  };

  // Set story-global variables.
  const story = {
    storyId: storyId,
    title,
    status: statusFormat,
    author,
    date,
    modified,
    excerpt,
    slug,
    link,
    extras,
    featuredMedia,
    permalinkConfig,
    publisherLogo,
    password,
    previewLink,
    editLink,
    embedPostLink,
    currentStoryStyles: {
      colors: storyData?.currentStoryStyles?.colors
        ? getUniquePresets(storyData.currentStoryStyles.colors)
        : [],
    },
    globalStoryStyles: newGlobalStoryStyles,
    autoAdvance: storyData?.autoAdvance,
    defaultPageDuration: storyData?.defaultPageDuration,
    backgroundAudio: storyData?.backgroundAudio,
    taxonomies,
    terms,
  };

  // TODO read current page and selection from deeplink?
  restore({
    pages,
    story,
    selection: [],
    current: null, // will be set to first page by `restore`
    capabilities,
  });
}

// When ID is set, load story from API.
function useLoadStory({ storyId, story, shouldLoad, restore }) {
  const {
    actions: { getStoryById },
  } = useAPI();
  const {
    actions: { clearHistory },
  } = useHistory();

  useEffect(() => {
    if (storyId && shouldLoad) {
      if (story) {
        loadStory(storyId, story, restore, clearHistory);
      } else {
        getStoryById(storyId).then((post) => {
          loadStory(storyId, post, restore, clearHistory);
        });
      }
    }
  }, [storyId, story, shouldLoad, restore, getStoryById, clearHistory]);
}

export default useLoadStory;
