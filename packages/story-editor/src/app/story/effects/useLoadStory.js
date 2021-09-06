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
import { useEffect } from '@web-stories-wp/react';
import { migrate } from '@web-stories-wp/migration';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useHistory } from '../../history';
import { createPage } from '../../../elements';
import getUniquePresets from '../../../utils/getUniquePresets';

/* eslint-disable complexity */

// When ID is set, load story from API.
function useLoadStory({ storyId, shouldLoad, restore, isDemo }) {
  const {
    actions: { getStoryById, getDemoStoryById },
  } = useAPI();
  const {
    actions: { clearHistory },
  } = useHistory();

  useEffect(() => {
    if (storyId && shouldLoad) {
      const callback = isDemo ? getDemoStoryById : getStoryById;
      callback(storyId).then((post) => {
        const {
          title: { raw: title },
          status,
          slug,
          date,
          modified,
          excerpt: { raw: excerpt },
          link,
          story_data: storyDataRaw,
          permalink_template: permalinkTemplate,
          style_presets: globalStoryStyles,
          password,
          preview_link: previewLink,
          edit_link: editLink,
          embed_post_link: embedPostLink,
          _embedded: embedded = {},
          _links: links = {},
        } = post;

        const capabilities = {
          hasPublishAction: Object.prototype.hasOwnProperty.call(
            links,
            'wp:action-publish'
          ),
          hasAssignAuthorAction: Object.prototype.hasOwnProperty.call(
            links,
            'wp:action-assign-author'
          ),
        };

        const author = {
          id: embedded?.author?.[0].id || 0,
          name: embedded?.author?.[0].name || '',
        };

        const lockUser = {
          id: embedded?.['wp:lockuser']?.[0].id || 0,
          name: embedded?.['wp:lockuser']?.[0].name || '',
          avatar: embedded?.['wp:lockuser']?.[0].avatar_urls?.['96'] || '',
        };

        const featuredMedia = {
          id: embedded?.['wp:featuredmedia']?.[0].id || 0,
          height:
            embedded?.['wp:featuredmedia']?.[0]?.media_details?.height || 0,
          width: embedded?.['wp:featuredmedia']?.[0]?.media_details?.width || 0,
          url: embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        };

        const publisherLogo = {
          id: embedded?.['wp:publisherlogo']?.[0].id || 0,
          height:
            embedded?.['wp:publisherlogo']?.[0]?.media_details?.height || 0,
          width: embedded?.['wp:publisherlogo']?.[0]?.media_details?.width || 0,
          url: embedded?.['wp:publisherlogo']?.[0]?.source_url || '',
        };

        const [prefix, suffix] = permalinkTemplate.split(
          /%(?:postname|pagename)%/
        );
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
        const pages =
          storyData?.pages?.length > 0 ? storyData.pages : [createPage()];

        // Initialize color/style presets, if missing.
        // Otherwise ensure the saved presets are unique.
        if (!globalStoryStyles.colors) {
          globalStoryStyles.colors = [];
        } else {
          globalStoryStyles.colors = getUniquePresets(globalStoryStyles.colors);
        }
        if (!globalStoryStyles.textStyles) {
          globalStoryStyles.textStyles = [];
        } else {
          globalStoryStyles.textStyles = getUniquePresets(
            globalStoryStyles.textStyles
          );
        }

        // Set story-global variables.
        const story = {
          storyId,
          title,
          status: statusFormat,
          author,
          date,
          modified,
          excerpt,
          slug,
          link,
          lockUser,
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
          globalStoryStyles,
          autoAdvance: storyData?.autoAdvance,
          defaultPageDuration: storyData?.defaultPageDuration,
          backgroundAudio: storyData?.backgroundAudio,
        };

        // TODO read current page and selection from deeplink?
        restore({
          pages,
          story,
          selection: [],
          current: null, // will be set to first page by `restore`
          capabilities,
        });
      });
    }
  }, [
    storyId,
    shouldLoad,
    restore,
    isDemo,
    getStoryById,
    getDemoStoryById,
    clearHistory,
  ]);
}

/* eslint-enable complexity */

export default useLoadStory;
