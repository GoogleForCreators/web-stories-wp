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
import { PRE_PUBLISH_MESSAGE_TYPES, MESSAGES } from '../constants';

/**
 * @typedef {import('../../../types').Story} Story
 * @typedef {import('../types').Guidance} Guidance
 */

/**
 * Check story for missing excerpt
 *
 * @param {Story} story The story being checked for warnings
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyMissingExcerpt(story) {
  if (!story.excerpt?.length) {
    return {
      message: MESSAGES.DISTRIBUTION.MISSING_DESCRIPTION.MAIN_TEXT,
      help: MESSAGES.DISTRIBUTION.MISSING_DESCRIPTION.HELPER_TEXT,
      storyId: story.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.WARNING,
      highlight: states.EXCERPT,
    };
  }

  return undefined;
}
