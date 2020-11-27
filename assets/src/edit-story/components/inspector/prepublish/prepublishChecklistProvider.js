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
import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { getPrepublishErrors } from '../../../app/prepublish';
import usePrevious from '../../../utils/usePrevious';
import Context from './context';

function PrepublishChecklistProvider({ children }) {
  const story = useStory(({ state: { story, pages } }) => {
    return { ...story, pages };
  });

  const [currentList, setCurrentList] = useState(() =>
    // use lazy initialization to prevent checklist from running on every update
    getPrepublishErrors(story)
  );

  const handleRefreshList = useCallback(
    () => setCurrentList(getPrepublishErrors(story)),
    [story]
  );

  const prevPages = usePrevious(story.pages);

  const refreshOnInitialLoad = prevPages?.length === 0 && story.pages?.length;

  useEffect(() => {
    if (refreshOnInitialLoad) {
      handleRefreshList();
    }
  }, [handleRefreshList, refreshOnInitialLoad]);

  return (
    <Context.Provider
      value={{ checklist: currentList, refreshChecklist: handleRefreshList }}
    >
      {children}
    </Context.Provider>
  );
}

PrepublishChecklistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrepublishChecklistProvider;
