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
import * as error from './error';
import * as warning from './warning';
import * as guidance from './guidance';

const storyChecklist = [...error.story, ...warning.story, ...guidance.story];
const pageChecklist = [...warning.page, ...guidance.page];
const elementChecklist = [...warning.element, ...guidance.element];

/**
 *
 * @typedef {import ('./types').Guidance} Guidance
 * @typedef {import('../../types').Story} Story
 */

/**
 *
 * @param {Story} story The full story object being checked for guidance messages.
 * @return {Guidance[]} The array of checklist items to be rectified.
 */

export default function prepublishChecklist(story) {
  const guidanceMessages = [];
  storyChecklist.forEach((getStoryGuidance) => {
    try {
      const storyGuidance = getStoryGuidance(story);
      if (typeof storyGuidance !== 'undefined') {
        guidanceMessages.push(storyGuidance);
      }
    } catch (e) {
      // Ignore errors
    }
  });

  pageChecklist.forEach((getPageGuidance) => {
    story?.pages?.forEach((page) => {
      try {
        const pageGuidance = getPageGuidance(page);
        if (typeof pageGuidance !== 'undefined') {
          guidanceMessages.push(pageGuidance);
        }
        const { elements } = page;
        elementChecklist.forEach(({ type: checkElementType, checklist }) => {
          elements.forEach((element) => {
            const isElementAllowed = checkElementType.includes(element.type);

            if (isElementAllowed) {
              checklist.forEach((getElementGuidance) => {
                const elementGuidance = getElementGuidance(element);

                if (typeof elementGuidance !== 'undefined') {
                  guidanceMessages.push({
                    ...elementGuidance,
                    pageId: page.id,
                  });
                }
              });
            }
          });
        });
      } catch (e) {
        // Ignore errors
      }
    });
  });

  return guidanceMessages;
}
