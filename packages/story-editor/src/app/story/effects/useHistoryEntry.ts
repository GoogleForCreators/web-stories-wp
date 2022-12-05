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
import { useEffect, useRef } from '@googleforcreators/react';
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useHistory } from '../../history';
import deleteNestedKeys from '../utils/deleteNestedKeys';
import pageContainsBlobUrl from '../utils/pageContainsBlobUrl';
import type { HistoryEntry } from '../../../types';

// Changes to these properties of elements do not create a new history entry
// if only one (or multiple) of these properties change but nothing else changes.
// These are still saved as part of changes involving other properties.
const ELEMENT_PROPS_TO_IGNORE = [
  'resource.baseColor',
  'resource.blurHash',
  'resource.id',
  'resource.isMuted',
  'resource.posterId',
  'resource.poster',
  'resource.font.metrics',
  'resource.font.weights',
  'resource.font.variants',
  'resource.font.fallbacks',
  'resource.font.styles',
  'resource.isOptimized',
  'resource.length',
  'resource.lengthFormatted',
  'resource.trimData.original',
  'resource.trimData.start',
  'resource.trimData.end',
  'resource.creationDate',
];

// Record any change to core variables in history (history will know if it's a replay)
function useHistoryEntry({
  story,
  current,
  pages,
  selection,
  capabilities,
}: HistoryEntry) {
  const {
    state: { currentEntry },
    actions: { stateToHistory },
  } = useHistory();

  const currentHistoryEntryRef = useRef<HistoryEntry | null>(null);
  useEffect(() => {
    if (currentEntry) {
      currentHistoryEntryRef.current = structuredClone(currentEntry);
    }
  }, [currentEntry]);

  const currentPageIdRef = useRef<string | null>(null);
  const selectedElementIdsRef = useRef<string[]>([]);
  useEffect(() => {
    currentPageIdRef.current = current;
    selectedElementIdsRef.current = selection;
  }, [current, selection]);

  const deleteKeysFromPages = (list: Page[]) => {
    // Create a copy of the list not to influence the original.
    return structuredClone(list).map((page) => {
      page.elements.forEach((element) =>
        deleteNestedKeys(ELEMENT_PROPS_TO_IGNORE)({ ...element })
      );
      return page;
    });
  };

  useEffect(() => {
    // There are some element properties that should not influence history.
    // Before adding a new history entry, let's check if the only properties that changed
    // should not influence history. Then we skip adding an entry.
    let skipAddingEntry = false;
    if (
      ELEMENT_PROPS_TO_IGNORE.length &&
      currentHistoryEntryRef.current &&
      pages?.length
    ) {
      // If story / capabilities change, we should always add a new entry.
      const withoutPages = {
        story,
        capabilities,
      };
      const onlyPagesChanged = Object.entries(withoutPages).every(
        ([key, value]) =>
          JSON.stringify(value) ===
          JSON.stringify(
            currentHistoryEntryRef.current?.[key as keyof HistoryEntry]
          )
      );
      // If only pages have changed, check if relevant properties have changed.
      if (onlyPagesChanged) {
        const adjustedPages = deleteKeysFromPages(pages);
        const adjustedEntryPages = deleteKeysFromPages(
          currentHistoryEntryRef.current.pages
        );
        // Check if after removing properties that shouldn't influence history, nothing changed.
        // Is so, let's skip adding a history entry.
        skipAddingEntry =
          JSON.stringify(adjustedPages) === JSON.stringify(adjustedEntryPages);
      }

      if (pageContainsBlobUrl(pages)) {
        skipAddingEntry = true;
      }
    }

    if (!skipAddingEntry) {
      stateToHistory({
        story,
        current: currentPageIdRef.current,
        selection: selectedElementIdsRef.current,
        pages,
        capabilities,
      });
    }
  }, [story, pages, stateToHistory, capabilities]);
}

export default useHistoryEntry;
