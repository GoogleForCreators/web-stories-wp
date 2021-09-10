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
/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

// Important: Keep in sync with REST API preloading definition.
const STORY_FIELDS = [
  'id',
  'title',
  'status',
  'slug',
  'date',
  'modified',
  'excerpt',
  'link',
  'story_data',
  'preview_link',
  'edit_link',
  'embed_post_link',
  'permalink_template',
  'style_presets',
  'password',
].join(',');

const STORY_EMBED = 'wp:featuredmedia,wp:lockuser,author,wp:publisherlogo';

export function getStoryById(storyId, stories) {
  const path = addQueryArgs(`${stories}${storyId}/`, {
    context: 'edit',
    _embed: STORY_EMBED,
    web_stories_demo: false,
    _fields: STORY_FIELDS,
  });

  return apiFetch({ path });
}

export function getDemoStoryById(storyId, stories) {
  const path = addQueryArgs(`${stories}${storyId}/`, {
    context: 'edit',
    _embed: STORY_EMBED,
    web_stories_demo: true,
    _fields: STORY_FIELDS,
  });

  return apiFetch({ path });
}

/**
 * Fire REST API call to save story.
 *
 * @param {import('@web-stories-wp/story-editor').StoryPropTypes.story} story Story object.
 * @param {Object} stories Stories
 * @param {Function} getStorySaveData Function to get save data.
 * @return {Promise} Return apiFetch promise.
 */
export function saveStoryById(story, stories, getStorySaveData) {
  const { storyId } = story;

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
    data: getStorySaveData(story),
    method: 'POST',
  });
}

/**
 * Fire REST API call to auto-save story.
 *
 * @param {import('@web-stories-wp/story-editor').StoryPropTypes.story} story Story object.
 * @param {Object} stories Stories
 * @param {Function} getStorySaveData Function to get save data.
 * @return {Promise} Return apiFetch promise.
 */
export function autoSaveById(story, stories, getStorySaveData) {
  const { storyId } = story;
  return apiFetch({
    path: `${stories}${storyId}/autosaves/`,
    data: getStorySaveData(story),
    method: 'POST',
  });
}
