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
import stripHTML from '../../utils/stripHTML';

const maxPageCharacterCount = 200;
const minStoryCharacterCount = 100;

const characterCountForPage = (page) => {
  let characterCount = 0;
  page.elements.forEach((element) => {
    if (element.type === 'text') {
      characterCount += stripHTML(element.content).length;
    }
  });
  return characterCount;
};

export const pageTooMuchText = (page) => {
  const characterCount = characterCountForPage(page);

  if (characterCount > maxPageCharacterCount) {
    return {
      message: 'Too much text on page',
      pageId: page.id,
      type: 'warning',
    };
  }

  return null;
};

export const storyTooLittleText = (story) => {
  let characterCount = 0;
  story.pages.forEach((page) => {
    characterCount += characterCountForPage(page);
  });

  if (characterCount < minStoryCharacterCount) {
    return {
      message: 'Too little text in story',
      storyId: story.id,
      type: 'warning',
    };
  }

  return null;
};
