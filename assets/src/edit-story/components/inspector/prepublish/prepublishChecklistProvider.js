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
import { useCallback, useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { getPrepublishErrors } from '../../../app/prepublish';
import usePrevious from '../../../../design-system/utils/usePrevious';
import { useLayout } from '../../../app/layout';
import Context from './context';
import {
  checkpointReducer,
  PPC_CHECKPOINT_STATE,
  PPC_CHECKPOINT_ACTION,
} from './prepublishCheckpointState';

function PrepublishChecklistProvider({ children }) {
  const pageSize = useLayout(({ state: { pageWidth, pageHeight } }) => ({
    width: pageWidth,
    height: pageHeight,
  }));

  const story = useStory(({ state: { story, pages } }) => {
    return { ...story, pages };
  });

  const [currentList, setCurrentList] = useState([]);

  const handleRefreshList = useCallback(async () => {
    const pagesWithSize = story.pages.map((page) => ({
      ...page,
      pageSize,
    }));
    setCurrentList(
      await getPrepublishErrors({ ...story, pages: pagesWithSize })
    );
  }, [story, pageSize]);

  const prevPages = usePrevious(story.pages);
  const prevPageSize = usePrevious(pageSize);

  const refreshOnInitialLoad = prevPages?.length === 0 && story.pages?.length;
  const refreshOnPageSizeChange = prevPageSize?.width !== pageSize?.width;

  useEffect(() => {
    if (refreshOnInitialLoad || refreshOnPageSizeChange) {
      handleRefreshList();
    }
  }, [handleRefreshList, refreshOnInitialLoad, refreshOnPageSizeChange]);

  const [checkpointState, dispatch] = useReducer(
    checkpointReducer,
    PPC_CHECKPOINT_STATE.ALL
  );

  // Check for different qualifications to be met to update current PPC checkpoint
  // 1. Story is no longer empty (ON_DIRTY_STORY)
  // 2. Publish button is hit on a draft (ON_PUBLISH_CLICKED)
  // 3. Story has more than 4 pages
  useEffect(() => {
    if (story.pages.length > 4) {
      dispatch(PPC_CHECKPOINT_ACTION.ON_STORY_HAS_5_PAGES);
    }
  }, [story?.pages]);

  return (
    <Context.Provider
      value={{
        checklist: currentList,
        refreshChecklist: handleRefreshList,
        currentCheckpoint: checkpointState,
      }}
    >
      {children}
    </Context.Provider>
  );
}

PrepublishChecklistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrepublishChecklistProvider;
