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
import { useEffect, useRef } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { useHistory } from '../../history';

const ELEMENT_PROPS_TO_IGNORE = [
  'resource.baseColor',
];

// Record any change to core variables in history (history will know if it's a replay)
function useHistoryEntry({ story, current, pages, selection, capabilities }) {
  const {
    state: { currentEntry },
    actions: { stateToHistory },
  } = useHistory();

  const currentHistoryEntryRef = useRef();
  useEffect(() => {
    currentHistoryEntryRef.current = currentEntry;
  }, [currentEntry]);

  const currentPageIndexRef = useRef();
  const selectedElementIdsRef = useRef();
  useEffect(() => {
    currentPageIndexRef.current = current;
    selectedElementIdsRef.current = selection;
  }, [current, selection]);

  const deleteNestedKey = (object, path) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const nextLastKey = keys.pop();
    const nextLastObj = keys.reduce((a, key) => a?.[key] || a, object);
    if (nextLastObj?.[nextLastKey]?.[lastKey]) {
      delete nextLastObj[nextLastKey][lastKey];
    }
    return object;
  };

  useEffect(() => {
    let skipAddingEntry = false;
    const adjustedPages = pages.map((page) => {
      const { elements } = page;
      return {
        ...page,
        elements: elements.map((element) =>
          deleteNestedKey(element, 'resource.baseColor')
        ),
      };
    });
    if (currentHistoryEntryRef.current && adjustedPages?.length) {
      skipAddingEntry = Object.keys(adjustedPages).every(
        (key) =>
          adjustedPages[key] === currentHistoryEntryRef.current.pages[key]
      );
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
