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
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { useStory } from '../story';

function useGetRecentFonts() {
  const { pages = [] } = useStory((state) => ({
    pages: state.state.pages,
  }));

  const getRecentFonts = useCallback(
    (fonts) => {
      if (!fonts.length) {
        return [];
      }
      const fontCounts = {};
      for (const { elements } of pages) {
        const textElements = elements.filter(({ type }) => type === 'text');

        for (const { font } of textElements) {
          const { family } = font;
          if (!fontCounts[family]) {
            fontCounts[family] = 1;
            continue;
          }
          fontCounts[family] = fontCounts[family] + 1;
        }
      }
      const recentFonts = Object.keys(fontCounts)
        .sort((a, b) => fontCounts[b] - fontCounts[a])
        .map((name) => fonts.find((font) => font['family'] === name));
      return recentFonts;
    },
    [pages]
  );

  return getRecentFonts;
}

export default useGetRecentFonts;
