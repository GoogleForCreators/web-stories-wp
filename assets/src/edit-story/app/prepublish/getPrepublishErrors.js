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
 * @param {Story} initialStoryState The full story object being checked for guidance messages.
 * @return {Guidance[]} The array of checklist items to be rectified.
 */

async function getPrepublishErrors(story) {
  if (!story) {
    return [];
  }
  const checklistResult = [error, warning, guidance]
    .map((byType) => {
      const {
        // arrays of functions
        story: storyChecklist = [],
        page: pageChecklist = [],
        ...elementChecklistsByType
      } = byType;

      const storyGuidance = [];

      // get guidance messages for the top-level story object
      storyChecklist.forEach((getStoryGuidance) => {
        try {
          const guidanceMessage = getStoryGuidance(story);
          if (guidanceMessage !== undefined) {
            storyGuidance.push(guidanceMessage);
          }
        } catch (e) {
          // ignore errors
        }
      });

      // for each page, run checklist on the page object as well as each element
      const { pageGuidance, elementGuidance } = story.pages.reduce(
        (prev, currentPage, currentIndex) => {
          const pageNum = currentIndex + 1;
          const { id: pageId, elements } = currentPage;

          function prepareResult(result) {
            if (typeof result !== 'undefined') {
              if (Array.isArray(result)) {
                return result.map((message) => ({
                  ...message,
                  page: pageNum,
                  pageId,
                }));
              }
              return {
                ...result,
                page: pageNum,
                pageId,
              };
            }
            return result;
          }

          // get guidance for the page object
          const currentPageGuidance = [];
          pageChecklist.forEach((getPageGuidance) => {
            try {
              const guidanceMessage = getPageGuidance(currentPage);
              if (guidanceMessage instanceof Promise) {
                const guidanceMessagePromise = guidanceMessage.then(
                  prepareResult
                );
                currentPageGuidance.push(guidanceMessagePromise);
              } else if (guidanceMessage !== undefined) {
                currentPageGuidance.push(prepareResult(guidanceMessage));
              }
            } catch (e) {
              // ignore errors
            }
          });

          // get guidance for all the elements on the page
          const currentPageElementGuidance = [];
          elements.forEach((element) => {
            const elementsChecklist =
              elementChecklistsByType[element.type] || [];

            elementsChecklist.forEach((getElementGuidance) => {
              try {
                const guidanceMessage = getElementGuidance(element);
                if (guidanceMessage instanceof Promise) {
                  const guidanceMessagePromise = guidanceMessage.then(
                    prepareResult
                  );
                  currentPageGuidance.push(guidanceMessagePromise);
                } else if (guidanceMessage !== undefined) {
                  currentPageElementGuidance.push(
                    prepareResult(guidanceMessage)
                  );
                }
              } catch (e) {
                // ignore errors
              }
            });
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
      );

      return [...storyGuidance, ...pageGuidance, ...elementGuidance];
    })
    // the checks may return arrays
    .flat();
  const awaitedResult = await Promise.all(checklistResult);
  // promises may return arrays
  return [...awaitedResult.flat().filter(Boolean)];
}

export default getPrepublishErrors;
