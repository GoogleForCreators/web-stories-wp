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
          slug,
          date_gmt,
          modified,
          excerpt: { raw: excerpt },
          link,
          story_data: storyDataRaw,
          // todo: get publisher_logo_url image dimensions for prepublish checklist
          publisher_logo_url: publisherLogoUrl,
          permalink_template: permalinkTemplate,
          style_presets: stylePresets,
          password,
          _embedded: embedded = {},
        } = post;
        const date = `${date_gmt}Z`;

        let author = {
          id: 0,
          name: '',
        };

        if ('author' in embedded) {
          author = {
            id: embedded.author[0].id,
            name: embedded.author[0].name,
          };
        }

        let featuredMedia = {
          id: 0,
          height: 0,
          width: 0,
          url: '',
        };

        if ('wp:featuredmedia' in embedded) {
          featuredMedia = {
            id: embedded['wp:featuredmedia'][0].id,
            height: embedded['wp:featuredmedia'][0].media_details?.height,
            width: embedded['wp:featuredmedia'][0].media_details?.width,
            url: embedded['wp:featuredmedia'][0].source_url,
          };
        }

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
