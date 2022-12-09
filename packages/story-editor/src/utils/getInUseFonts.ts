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
 * External dependencies
 */
import type { Page } from '@googleforcreators/elements';
import type { TextSet } from '@googleforcreators/text-sets';
import { elementIs } from '@googleforcreators/elements';

/**
 * Returns a list of font names used across all pages in a story.
 */
export function getInUseFontsForPages(pages: Page[]) {
  return (
    Array.from(
      new Set(
        pages
          .map(({ elements = [] }) =>
            elements.map((element) =>
              elementIs.text(element) ? element.font.family : null
            )
          )
          .flat()
          .filter(Boolean)
      )
    ) || []
  );
}

interface GetTextSetsForFontsProps {
  fonts: string[];
  textSets: TextSet[];
}

/**
 * Returns a list of text sets that include the fonts provided in the options object.
 *
 * @param options Object containing an array of fonts and text sets to filter.
 * @return List of text sets that match the array of fonts.
 */
export function getTextSetsForFonts({
  fonts,
  textSets,
}: GetTextSetsForFontsProps) {
  return textSets
    .map((currentTextSet) => {
      const hasFontInUse = currentTextSet.elements.reduce(
        (elementMemo, currentElement) => {
          if (!elementIs.text(currentElement)) {
            return elementMemo;
          }

          return (
            elementMemo || fonts.indexOf(currentElement.font.family) !== -1
          );
        },
        false
      );
      return hasFontInUse && currentTextSet;
    })
    .filter(Boolean);
}
