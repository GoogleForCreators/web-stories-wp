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
import error from './error';
import warning from './warning';
import guidance from './guidance';

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
  if (!story) {
    return [];
  }
  return [error, warning, guidance]
    .map((byType) => {
      const {
        // arrays of functions
        story: storyChecklist = [],
        page: pageChecklist = [],
        ...elementChecklistsByType
      } = byType;

      let storyGuidance = [],
        pageGuidance = [],
        elementGuidance = [];

      // get guidance messages for the top-level story object

      try {
        storyChecklist.forEach((getStoryGuidance) => {
          const guidanceMessage = getStoryGuidance(story);
          if (guidanceMessage !== undefined) {
            storyGuidance.push(guidanceMessage);
          }
        });
      } catch (e) {
        // ignore errors
      }

      // for each page, run checklist on the page object as well as each element
      ({ pageGuidance, elementGuidance } = story.pages.reduce(
        (prev, currentPage) => {
          const { id: pageId, elements } = currentPage;

          // get guidance for the page object
          const currentPageGuidance = [];
          try {
            pageChecklist.forEach((getPageGuidance) => {
              const guidanceMessage = getPageGuidance(currentPage);
              if (guidanceMessage !== undefined) {
                currentPageGuidance.push(guidanceMessage);
              }
            });
          } catch (e) {
            // ignore errors
          }

          // get guidance for all the elements on the page
          let currentPageElementGuidance = [];
          elements.forEach((element) => {
            const elementsChecklist =
              elementChecklistsByType[element.type] || [];

            try {
              elementsChecklist.forEach((getElementGuidance) => {
                const guidanceMessage = getElementGuidance(element);
                if (guidanceMessage !== undefined) {
                  currentPageElementGuidance.push({
                    ...guidanceMessage,
                    // provide the page the element is on
                    pageId,
                  });
                }
              });
            } catch (e) {
              // ignore errors
            }
          });

          return {
            pageGuidance: [...prev.pageGuidance, ...currentPageGuidance],
            elementGuidance: [
              ...prev.elementGuidance,
              ...currentPageElementGuidance,
            ],
          };
        },
        {
          pageGuidance: [],
          elementGuidance: [],
        }
      ));

      return [...storyGuidance, ...pageGuidance, ...elementGuidance];
    })
    .flat();
}
