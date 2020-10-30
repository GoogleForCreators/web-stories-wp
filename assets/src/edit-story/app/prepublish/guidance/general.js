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
import { __, sprintf } from '@wordpress/i18n';
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
const MIN_STORY_PAGES_RECOMMENDED = 10;
const MAX_STORY_PAGES_RECOMMENDED = 20;
const MAX_STORY_TITLE_LENGTH = 40;

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
      ? sprintf(
          /* translators: 1: minimum number of pages. 2: recommended number of pages. */
          __(
            'Story has fewer than %1$d pages (ideally, stories should have a minimum of %2$d pages)',
            'web-stories'
          ),
          MIN_STORY_PAGES,
          MIN_STORY_PAGES_RECOMMENDED
        )
      : sprintf(
          /* translators: 1: maximum number of pages. 2: recommended number of pages. */
          __(
            "Story has more than %1$d pages (ideally, stories shouldn't have more than %2$d pages)",
            'web-stories'
          ),
          MAX_STORY_PAGES,
          MAX_STORY_PAGES_RECOMMENDED
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
  if (story.title.length > MAX_STORY_TITLE_LENGTH) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      storyId: story.storyId,
      message: sprintf(
        /* translators: %d: maximum story title length. */
        __('Story title is longer than %d characters', 'web-stories'),
        MAX_STORY_TITLE_LENGTH
      ),
    };
  }
  return undefined;
}
