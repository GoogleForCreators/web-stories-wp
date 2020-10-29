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
import { PRE_PUBLISH_MESSAGE_TYPES } from '../constants';

/**
 * @typedef {import('../types').Guidance} Guidance
 * @typedef {import('../../../types').Story} Story
 */

const MIN_STORY_PAGES = 4;
const MAX_STORY_PAGES = 30;

/**
 * Check the number of pages in a Story.
 * If the Story has less than 4 pages or more than 30 pages return guidance
 * Otherwise return undefined.
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyPagesCount(story) {
  const hasTooFewPages = story.pages.length < MIN_STORY_PAGES;
  const hasTooManyPages = story.pages.length > MAX_STORY_PAGES;
  if (hasTooFewPages || hasTooManyPages) {
    const message = hasTooFewPages
      ? __(
          'Story has fewer than 4 pages (ideally, stories should have a minimum of 10 pages)',
          'web-stories'
        )
      : __(
          "Story has more than 30 pages (ideally, stories shouldn't have more than 20 pages)",
          'web-stories'
        );
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      storyId: story.storyId,
      message,
    };
  }
  return undefined;
}

/**
 * Check the length of the story's title
 * If the Story title is longer than 40 characters return guidance
 * Otherwise return undefined
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyTitleLength(story) {
  if (story.title.length > 40) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      storyId: story.storyId,
      message: __('Story title is longer than 40 characters', 'web-stories'),
    };
  }
  return undefined;
}

/**
 * Check that a cover/poster is attached to the Story
 * Otherwise return undefined.
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyPosterAttached(story) {
  if (typeof story.featuredMediaUrl !== 'string') {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      storyId: story.storyId,
      message: __('Missing story poster/cover', 'web-stories'),
    };
  }
  return undefined;
}

// todo: square and landscape story cover/poster sizes
/**
 * Check the number of pages in a Story.
 * If the Story has less than 4 pages or more than 30 pages return guidance
 * Otherwise return undefined.
 *
 * @param {Story} story The story object being checked
 * @return {Guidance|undefined} The guidance object for consumption
 */
// export function storyPosterSize(story) {}
