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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useAPI, useHistory } from '../../';
import { createPage } from '../../../elements';
import { migrate } from '../../../migration';

// When ID is set, load story from API.
function useLoadStory({ storyId, shouldLoad, restore }) {
  const {
    actions: { getStoryById },
  } = useAPI();
  const {
    actions: { clearHistory },
  } = useHistory();

  useEffect(() => {
    if (storyId && shouldLoad) {
      getStoryById(storyId).then((post) => {
        const {
          title: { raw: title },
          status,
          author,
          slug,
          date_gmt,
          modified,
          excerpt: { raw: excerpt },
          link,
          story_data: storyDataRaw,
          // todo: get featured_media_url original dimensions for prepublish checklist
          featured_media: featuredMedia,
          featured_media_url: featuredMediaUrl,
          // todo: get publisher_logo_url image dimensions for prepublish checklist
          publisher_logo_url: publisherLogoUrl,
          permalink_template: permalinkTemplate,
          style_presets: stylePresets,
          password,
        } = post;
        const date = `${date_gmt}Z`;

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
        if (!stylePresets.colors) {
          stylePresets.colors = [];
        }
        if (!stylePresets.textStyles) {
          stylePresets.textStyles = [];
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
          featuredMedia,
          featuredMediaUrl,
          permalinkConfig,
          publisherLogoUrl,
          password,
          stylePresets,
          autoAdvance: storyData?.autoAdvance,
          defaultPageDuration: storyData?.defaultPageDuration,
        };

        // TODO read current page and selection from deeplink?
        restore({
          pages,
          story,
          selection: [],
          current: null, // will be set to first page by `restore`
        });
      });
    }
  }, [storyId, shouldLoad, restore, getStoryById, clearHistory]);
}

export default useLoadStory;
