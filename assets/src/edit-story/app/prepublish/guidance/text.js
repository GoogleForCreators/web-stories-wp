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
import stripHTML from '../../../utils/stripHTML';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../constants';

const MAX_PAGE_CHARACTER_COUNT = 200;
const MIN_STORY_CHARACTER_COUNT = 100;

function characterCountForPage(page) {
  let characterCount = 0;
  page.elements.forEach((element) => {
    if (element.type === 'text') {
      characterCount += stripHTML(element.content).length;
    }
  });
  return characterCount;
}

/**
 * @typedef {import('../../../types').Story} Story
 * @typedef {import('../../../types').Page} Page
 * @typedef {import('../types').Guidance} Guidance
 */

/**
 * Check page for too much text
 *
 * @param {Page} page The page being checked for guidelines
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function pageTooMuchText(page) {
  const characterCount = characterCountForPage(page);

  if (characterCount > MAX_PAGE_CHARACTER_COUNT) {
    return {
      message: __('Too much text on page', 'web-stories'),
      pageId: page.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
    };
  }

  return undefined;
}

/**
 * Check story for too little text
 *
 * @param {Story} story The story being checked for guidelines
 * @return {Guidance|undefined} The guidance object for consumption
 */
export function storyTooLittleText(story) {
  let characterCount = 0;
  story.pages.forEach((page) => {
    characterCount += characterCountForPage(page);
  });

  if (characterCount < MIN_STORY_CHARACTER_COUNT) {
    return {
      message: __('Too little text in story', 'web-stories'),
      storyId: story.id,
      type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
    };
  }

  return undefined;
}
