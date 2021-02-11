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
 * Internal dependencies
 */
import { states } from '../../highlights';
import {
  PRE_PUBLISH_MESSAGE_TYPES,
  MESSAGES,
  MIN_STORY_PAGES,
  MAX_STORY_PAGES,
  MAX_STORY_TITLE_LENGTH_CHARS,
} from '../constants';

/**
 * @typedef {import('../types').Guidance} Guidance
 * @typedef {import('../../../types').Story} Story
 */

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
      ? {
          message: MESSAGES.GENERAL_GUIDELINES.STORY_TOO_SHORT.MAIN_TEXT,
          help: MESSAGES.GENERAL_GUIDELINES.STORY_TOO_SHORT.HELPER_TEXT,
        }
      : {
          message: MESSAGES.GENERAL_GUIDELINES.STORY_TOO_LONG.MAIN_TEXT,
          help: MESSAGES.GENERAL_GUIDELINES.STORY_TOO_LONG.HELPER_TEXT,
        };
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      storyId: story.id,
      ...message,
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
  if (story.title?.length > MAX_STORY_TITLE_LENGTH_CHARS) {
    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
      storyId: story.id,
      message: MESSAGES.GENERAL_GUIDELINES.STORY_TITLE_TOO_LONG.MAIN_TEXT,
      help: MESSAGES.GENERAL_GUIDELINES.STORY_TITLE_TOO_LONG.HELPER_TEXT,
      highlight: states.STORY_TITLE,
    };
  }
  return undefined;
}
