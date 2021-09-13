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
import { base64Encode } from './utils';

export function getStoryById(storyId, stories, isDemo = false) {
  const path = addQueryArgs(`${stories}${storyId}/`, {
    context: 'edit',
    _embed: STORY_EMBED,
    web_stories_demo: isDemo,
    _fields: STORY_FIELDS,
  });

  return apiFetch({ path });
}

export function getDemoStoryById(storyId, stories) {
  return getStoryById(storyId, stories, true);
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
 * @param {import('@web-stories-wp/story-editor').StoryPropTypes.story} story Story object.
 * @param {Object} stories Stories
 * @param {boolean} encodeMarkup Encode markup.
 * @return {Promise} Return apiFetch promise.
 */
export function saveStoryById(story, stories, encodeMarkup) {
  const { storyId } = story;
  const storySaveData = getStorySaveData(story, encodeMarkup);

  // Only require these fields in the response as used by useSaveStory()
  // to reduce response size.
  const path = addQueryArgs(`${stories}${storyId}/`, {
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
  });
}

/**
 * Fire REST API call to auto-save story.
 *
 * @param {import('@web-stories-wp/story-editor').StoryPropTypes.story} story Story object.
 * @param {Object} stories Stories
 * @param {boolean} encodeMarkup Encode markup.
 * @return {Promise} Return apiFetch promise.
 */
export function autoSaveById(story, stories, encodeMarkup) {
  const { storyId } = story;
  const storySaveData = getStorySaveData(story, encodeMarkup);

  return apiFetch({
    path: `${stories}${storyId}/autosaves/`,
    data: storySaveData,
    method: 'POST',
  });
}
