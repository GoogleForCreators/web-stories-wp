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
import { useCallback, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../story';
import Context from './context';
import getValidationIssues from './utils/getValidationIssues';

function ChecklistProvider({ children }) {
  const { checklist, setChecklist, pages } = useStory(
    ({ state: { checklist, pages }, actions: { setChecklist } }) => ({
      setChecklist,
      checklist,
      pages,
    })
  );

  useEffect(() => {
    if (!checklist && pages?.length > 0) {
      const _checklist = getValidationIssues(pages);
      console.log(_checklist);
      //setChecklist([]);
    }
  }, [checklist, setChecklist, pages]);

  const updateChecklist = useCallback(
    (value) => setChecklist({ checklist: value }),
    [setChecklist]
  );

  const setPageChecklist = useCallback(
    (pageId, elements) => {
      return;
      const errors = elements.reduce((obj, cur) => {
        return { ...obj, [cur.id]: [] };
      }, {});
      if (
        errors &&
        JSON.stringify(errors) !== JSON.stringify(checklist?.[pageId])
      ) {
        updateChecklist({
          ...checklist,
          [pageId]: errors,
        });
      }
    },
    [checklist, updateChecklist]
  );

  const state = {
    state: {
      checklist,
    },
    actions: {
      setPageChecklist,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

ChecklistProvider.propTypes = {
  children: PropTypes.node,
};

export default ChecklistProvider;
