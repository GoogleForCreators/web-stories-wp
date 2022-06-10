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
import cloneDeep from 'clone-deep';
import { useEffect, useRef } from '@googleforcreators/react';
import { isBlobURL } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { useHistory } from '../../history';
import deleteNestedKeys from '../utils/deleteNestedKeys';

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
  'resource.isOptimized',
  'resource.font.metrics',
  'resource.font.weights',
  'resource.font.variants',
  'resource.font.fallbacks',
  'resource.font.styles',
];

// Record any change to core variables in history (history will know if it's a replay)
function useHistoryEntry({ story, current, pages, selection, capabilities }) {
  const {
    state: { currentEntry },
    actions: { stateToHistory },
  } = useHistory();

  const currentHistoryEntryRef = useRef();
  useEffect(() => {
    if (currentEntry) {
      currentHistoryEntryRef.current = cloneDeep(currentEntry);
    }
  }, [currentEntry]);

  const currentPageIndexRef = useRef();
  const selectedElementIdsRef = useRef();
  useEffect(() => {
    currentPageIndexRef.current = current;
    selectedElementIdsRef.current = selection;
  }, [current, selection]);

  const deleteKeysFromPages = (list) => {
    // Create a copy of the list not to influence the original.
    return cloneDeep(list).map((page) => {
      page.elements.forEach(deleteNestedKeys(ELEMENT_PROPS_TO_IGNORE));
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
      const onlyPagesChanged = Object.keys(withoutPages).every(
        (key) =>
          JSON.stringify(withoutPages[key]) ===
          JSON.stringify(currentHistoryEntryRef.current[key])
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

      // skip entries that have a blob url
      // https://github.com/GoogleForCreators/web-stories-wp/issues/10289
      pages.map((page) => {
        page.elements.forEach((element) => {
          if (isBlobURL(element?.resource?.src)) {
            skipAddingEntry = true;
          }
        });
      });
    }

    if (!skipAddingEntry) {
      stateToHistory({
        story,
        current: currentPageIndexRef.current,
        selection: selectedElementIdsRef.current,
        pages,
        capabilities,
      });
    }
  }, [story, pages, stateToHistory, capabilities]);
}

export default useHistoryEntry;
