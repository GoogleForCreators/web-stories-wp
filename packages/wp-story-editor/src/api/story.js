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
import { addQueryArgs } from '@web-stories-wp/design-system';
import { DATA_VERSION } from '@web-stories-wp/migration';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORY_EMBED, STORY_FIELDS } from './constants';
import { base64Encode, snakeToCamelCaseObjectKeys } from './utils';

// Add custom fields and prepare story response.
const transformStoryResponse = (post) => {
  const { _embedded: embedded = {}, _links: links = {}, ...rest } = post;

  // TODO: Make author, lockUser, etc. null if absent, instead of these "empty" objects.
  const story = {
    ...snakeToCamelCaseObjectKeys(rest, ['story_data']),
    author: {
      id: embedded?.author?.[0].id || 0,
      name: embedded?.author?.[0].name || '',
    },
    capabilities: {},
    lockUser: {
      id: embedded?.['wp:lockuser']?.[0].id || 0,
      name: embedded?.['wp:lockuser']?.[0].name || '',
      avatar: embedded?.['wp:lockuser']?.[0].avatar_urls?.['96'] || '',
    },
    featuredMedia: {
      id: embedded?.['wp:featuredmedia']?.[0].id || 0,
      height: embedded?.['wp:featuredmedia']?.[0]?.media_details?.height || 0,
      width: embedded?.['wp:featuredmedia']?.[0]?.media_details?.width || 0,
      url: embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    },
    publisherLogo: {
      id: embedded?.['wp:publisherlogo']?.[0].id || 0,
      height: embedded?.['wp:publisherlogo']?.[0]?.media_details?.height || 0,
      width: embedded?.['wp:publisherlogo']?.[0]?.media_details?.width || 0,
      url: embedded?.['wp:publisherlogo']?.[0]?.source_url || '',
    },
    taxonomies: links?.['wp:term']?.map(({ taxonomy }) => taxonomy) || [],
    terms: embedded?.['wp:term'] || [],
  };

  for (const link of Object.keys(links)) {
    if (!link.startsWith('wp:action-')) {
      continue;
    }

    // Turn 'wp:action-assign-author' into 'assign-author'
    const capability = link.replace('wp:action-', '');
    story.capabilities[capability] = true;
  }

  return story;
};

export function getStoryById(config, storyId, isDemo = false) {
  const path = addQueryArgs(`${config.api.stories}${storyId}/`, {
    context: 'edit',
    _embed: STORY_EMBED,
    web_stories_demo: isDemo,
    _fields: STORY_FIELDS,
  });

  return apiFetch({ path }).then(transformStoryResponse);
}

export function getDemoStoryById(config, storyId) {
  return getStoryById(config, storyId, true);
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
 * @param {import('@web-stories-wp/story-editor').StoryPropTypes.story} story Story object.
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
    const { _embedded: embedded = {} } = data;

    data.featured_media = {
      id: embedded?.['wp:featuredmedia']?.[0].id || 0,
      height: embedded?.['wp:featuredmedia']?.[0]?.media_details?.height || 0,
      width: embedded?.['wp:featuredmedia']?.[0]?.media_details?.width || 0,
      url: embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    };

    return snakeToCamelCaseObjectKeys(data);
  });
}

/**
 * Fire REST API call to auto-save story.
 *
 * @param {Object} config API path.
 * @param {import('@web-stories-wp/story-editor').StoryPropTypes.story} story Story object.
 * @return {Promise} Return apiFetch promise.
 */
export function autoSaveById(config, story) {
  const { storyId } = story;
  const storySaveData = getStorySaveData(story, config.encodeMarkup);

  return apiFetch({
    path: `${config.api.stories}${storyId}/autosaves/`,
    data: storySaveData,
    method: 'POST',
  }).then(snakeToCamelCaseObjectKeys);
}
