/*
 * Copyright 2022 Google LLC
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
import { trackEvent } from '@googleforcreators/tracking';
import { useCallback } from '@googleforcreators/react';
import { createPage, duplicatePage } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../..';

/**
 * Creates the right click menu page actions.
 *
 * @return {Object} Right click menu page actions
 */
const usePageActions = () => {
  const {
    addPageAt,
    currentPage,
    deleteCurrentPage,
    isSelectedElementBackground,
    pageLength,
    selectedElementType,
  } = useStory(({ state, actions }) => ({
    addPageAt: actions.addPageAt,
    currentPage: state.currentPage,
    deleteCurrentPage: actions.deleteCurrentPage,
    isSelectedElementBackground:
      state.selectedElements?.[0]?.background || false,
    pageLength: state.pages?.length || 1,
    selectedElementType: state.selectedElements?.[0]?.type || null,
  }));

  /**
   * Adds a new page at the designated index.
   *
   * Defaults to adding the new page after all of the existing pages.
   *
   * @param {number} index The index
   */
  const handleAddPageAtPosition = useCallback(
    (index) => {
      let position = Boolean(index) || index === 0 ? index : pageLength - 1;
      position = position > pageLength ? pageLength - 1 : position;
      position = position < 0 ? 0 : position;

      addPageAt({ page: createPage(), position });

      trackEvent('context_menu_action', {
        name: 'page_added',
        element: selectedElementType,
        isBackground: isSelectedElementBackground,
      });
    },
    [addPageAt, isSelectedElementBackground, pageLength, selectedElementType]
  );

  /**
   * Duplicate the current page.
   */
  const handleDuplicatePage = useCallback(() => {
    addPageAt({ page: duplicatePage(currentPage), position: null });
  }, [addPageAt, currentPage]);

  /**
   * Delete the current page.
   */
  const handleDeletePage = useCallback(() => {
    deleteCurrentPage();

    trackEvent('context_menu_action', {
      name: 'page_deleted',
      element: selectedElementType,
      isBackground: isSelectedElementBackground,
    });
  }, [deleteCurrentPage, isSelectedElementBackground, selectedElementType]);

  return {
    handleAddPageAtPosition,
    handleDuplicatePage,
    handleDeletePage,
  };
};

export default usePageActions;
