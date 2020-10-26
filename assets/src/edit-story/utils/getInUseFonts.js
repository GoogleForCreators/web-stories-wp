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
 * Returns a list of font names used across all pages in a story.
 *
 * @param {Array<import('../types').Page>} pages List of pages.
 *
 * @return {Array<string>} Font names.
 */
export function getInUseFontsForPages(pages) {
  return (
    Array.from(
      new Set(
        pages
          .map(({ elements = [] }) =>
            elements.map((element) => {
              if (element.type === 'text' && Boolean(element.font?.family)) {
                return element.font?.family;
              }
              return null;
            })
          )
          .flat()
          .filter(Boolean)
      )
    ) || []
  );
}

/**
 * Returns a list of text sets that include the fonts provided in the options object.
 *
 * @param {Array<Object>} options Object containing an array of fonts and text sets to filter.
 *
 * @return {Array<Object>} List of text sets that match the array of fonts.
 */
export function getTextSetsForFonts({ fonts, textSets }) {
  return textSets
    .map((currentTextSet) => {
      const hasFontInUse = currentTextSet.reduce(
        (elementMemo, currentElement) => {
          if (
            currentElement.type === 'text' &&
            Boolean(currentElement.font?.family)
          ) {
            return (
              elementMemo | (fonts.indexOf(currentElement.font?.family) !== -1)
            );
          }
          return elementMemo;
        },
        false
      );
      return hasFontInUse && currentTextSet;
    })
    .filter(Boolean);
}
