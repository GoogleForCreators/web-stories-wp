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
import { useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useHistory } from '../../';

// Record any change to core variables in history (history will know if it's a replay)
function useHistoryEntry({ story, current, pages, selection }) {
  const {
    actions: { stateToHistory },
  } = useHistory();

  const currentPageIndexRef = useRef();
  const selectedElementIdsRef = useRef();
  useEffect(() => {
    currentPageIndexRef.current = current;
    selectedElementIdsRef.current = selection;
  }, [current, selection]);

  useEffect(() => {
    stateToHistory({
      story,
      current: currentPageIndexRef.current,
      selection: selectedElementIdsRef.current,
      pages,
    });
  }, [story, pages, stateToHistory]);
}

export default useHistoryEntry;
