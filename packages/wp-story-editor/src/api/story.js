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
import { addQueryArgs } from '@googleforcreators/url';
import { DATA_VERSION } from '@googleforcreators/migration';
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORY_EMBED, STORY_FIELDS } from './constants';
import { base64Encode, transformStoryResponse } from './utils';

export function getStoryById(config, storyId) {
  const path = addQueryArgs(`${config.api.stories}${storyId}/`, {
    context: 'edit',
    _embed: STORY_EMBED,
    _fields: STORY_FIELDS,
  });

  return apiFetch({ path }).then(transformStoryResponse);
}

const getStorySaveData = (
  {
    pages,
    featuredMedia,
    globalStoryStyles,
    publisherLogo,
    autoAdvance,
    defaultPageDuration,
    currentStoryStyles,
    backgroundAudio,
    content,
    author,
    ...rest
  },
  encodeMarkup
) => {
  return {
    story_data: {
      version: DATA_VERSION,
      pages,
      autoAdvance,
      defaultPageDuration,
      currentStoryStyles,
      backgroundAudio,
    },
    featured_media: featuredMedia.id,
    style_presets: globalStoryStyles,
    meta: {
      web_stories_publisher_logo: publisherLogo?.id,
    },
    publisher_logo: publisherLogo,
    content: encodeMarkup ? base64Encode(content) : content,
    author: author.id,
    ...rest,
  };
};

/**
 * Fire REST API call to save story.
 *
 * @param {Object} config Configuration object.
 * @param {import('@googleforcreators/story-editor').StoryPropTypes.story} story Story object.
 * @return {Promise} Return apiFetch promise.
 */
export function saveStoryById(config, story) {
  const { storyId } = story;
  const storySaveData = getStorySaveData(story, config.encodeMarkup);

  // Only require these fields in the response as used by useSaveStory()
  // to reduce response size.
  const path = addQueryArgs(`${config.api.stories}${storyId}/`, {
    _fields: [
      'status',
      'slug',
      'link',
      'preview_link',
      'edit_link',
      'embed_post_link',
    ].join(','),
    _embed: STORY_EMBED,
  });

  return apiFetch({
    path,
    data: storySaveData,
    method: 'POST',
  }).then((data) => {
    const { _embedded: embedded = {}, ...rest } = data;

    return {
      ...snakeToCamelCaseObjectKeys(rest),
      featuredMedia: {
        id: embedded?.['wp:featuredmedia']?.[0].id || 0,
        height: embedded?.['wp:featuredmedia']?.[0]?.media_details?.height || 0,
        width: embedded?.['wp:featuredmedia']?.[0]?.media_details?.width || 0,
        url: embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      },
    };
  });
}

/**
 * Fire REST API call to auto-save story.
 *
 * @param {Object} config API path.
 * @param {import('@googleforcreators/story-editor').StoryPropTypes.story} story Story object.
 * @return {Promise} Return apiFetch promise.
 */
export function autoSaveById(config, story) {
  const { storyId } = story;
  const storySaveData = getStorySaveData(story, config.encodeMarkup);

  return apiFetch({
    path: `${config.api.stories}${storyId}/autosaves/`,
    data: storySaveData,
    method: 'POST',
  }).then((resp) => snakeToCamelCaseObjectKeys(resp, ['story_data']));
}
