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
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../story';
import Context from './context';
import getValidationIssues from './utils/getValidationIssues';

function ChecklistProvider({ children }) {
  const { checklist, setChecklist, pages, currentPage } = useStory(
    ({
      state: { checklist, pages, currentPage },
      actions: { setChecklist },
    }) => ({
      setChecklist,
      checklist,
      pages,
      currentPage,
    })
  );

  const updateChecklist = useCallback(
    (value) => setChecklist({ checklist: value }),
    [setChecklist]
  );

  const pagesLengthTracker = useRef(pages?.length);

  useEffect(() => {
    if (pages.length !== pagesLengthTracker.current) {
      pagesLengthTracker.current = pages.length;
    }
  }, [pages]);

  const regenerateChecklist = useCallback(
    (toProcess) => {
      const issues = getValidationIssues(
        toProcess && checklist ? toProcess : pages
      );
      const _checklist =
        toProcess && checklist
          ? {
              errors: {
                ...checklist.errors,
                ...issues.errors,
              },
              recommendations: {},
            }
          : issues;
      updateChecklist(_checklist);
    },
    [checklist, pages, updateChecklist]
  );

  useEffect(() => {
    // Whenever the number of pages changes, we're regenerating the checklist again.
    regenerateChecklist();
  }, [pagesLengthTracker, regenerateChecklist]);

  useEffect(() => {
    if (!checklist && pages?.length > 0) {
      regenerateChecklist();
    }
  }, [regenerateChecklist, checklist, pages]);

  useEffect(() => {
    if (currentPage) {
      regenerateChecklist([currentPage]);
    }
  }, [currentPage, regenerateChecklist]);

  const state = {
    state: {
      checklist,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

ChecklistProvider.propTypes = {
  children: PropTypes.node,
};

export default ChecklistProvider;
