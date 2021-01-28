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
import { PRE_PUBLISH_MESSAGE_TYPES, MESSAGES } from '../constants';

/**
 *
 * @typedef {import('../types').Guidance} Guidance
 * @typedef {import('../../../types').Story} Story
 */

/**
 * Check the story for AMP validation errors.
 *
 * @param {Story} story The story being checked for critical metadata
 * @return {Guidance|undefined} Guidance object for consumption
 */
export async function ampValidation(story) {
  // TODO: Enable for drafts as well?
  if (!story?.link || !['publish', 'future'].includes(story?.status)) {
    return undefined;
  }

  // TODO: Add some memoization.
  try {
    const response = await fetch(story.link);
    const storyMarkup = await response.text();

    const { status, errors } = window.amp.validator.validateString(storyMarkup);

    if ('FAIL' !== status) {
      return undefined;
    }

    const filteredErrors = errors
      .filter(({ severity }) => severity === 'ERROR')
      .filter(({ code, params }) => {
        // Already covered by metadata checks.
        if ('MISSING_URL' === code && params[0].startsWith('poster')) {
          return false;
        }

        // AMP attribute is removed by the pluggin if there is no cover image.
        if (
          'MANDATORY_ATTR_MISSING' === code &&
          params[0] === '⚡' &&
          params[1] === 'html'
        ) {
          return false;
        }

        return true;
      });

    if (filteredErrors.length === 0) {
      return undefined;
    }

    return {
      type: PRE_PUBLISH_MESSAGE_TYPES.ERROR,
      storyId: story.id,
      message: MESSAGES.VALIDATION.AMP_VALIDATION.MAIN_TEXT,
      help: MESSAGES.VALIDATION.AMP_VALIDATION.HELPER_TEXT,
    };
  } catch (err) {
    // TODO: Track errors?
    console.log(err);
  }

  return undefined;
}
