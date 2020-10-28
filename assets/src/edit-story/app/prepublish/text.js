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
import stripHTML from '../../utils/stripHTML';

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
 * Check page for too much text
 *
 * @param  {Object} page Page object
 * @return {Object} Prepublish check response
 */
export function pageTooMuchText(page) {
  const characterCount = characterCountForPage(page);

  if (characterCount > MAX_PAGE_CHARACTER_COUNT) {
    return {
      message: __('Too much text on page', 'web-stories'),
      pageId: page.id,
      type: 'guidance',
    };
  }

  return undefined;
}

/**
 * Check story for too little text
 *
 * @param {Object} page Page object
 * @param story
 * @return {Object} Prepublish check response
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
      type: 'guidance',
    };
  }

  return undefined;
}
