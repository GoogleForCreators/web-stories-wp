/*
 * Copyright 2021 Google LLC
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
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useCallback, useMemo, useState } from 'react';
import { useStory } from '../../../../app/story';
import isDefaultPage from '../../../../utils/isDefaultPage';
import { duplicatePage } from '../../../../elements';

function useTemplateActions() {
  const { replaceCurrentPage, currentPage } = useStory(
    ({ actions: { replaceCurrentPage }, state: { currentPage } }) => ({
      replaceCurrentPage,
      currentPage,
    })
  );
  const [selectedPage, setSelectedPage] = useState();
  const [isConfirming, setIsConfirming] = useState();

  const requiresConfirmation = useMemo(
    () => currentPage && !isDefaultPage(currentPage),
    [currentPage]
  );

  const handleApplyPageTemplate = useCallback(
    (page) => {
      const duplicatedPage = duplicatePage(page);
      replaceCurrentPage({ page: duplicatedPage });
      trackEvent('insert_page_template', {
        name: page.title,
      });

      setSelectedPage(null);
    },
    [replaceCurrentPage]
  );

  const handlePageClick = useCallback(
    (page) => {
      if (requiresConfirmation) {
        setIsConfirming(true);
        setSelectedPage(page);
      } else {
        handleApplyPageTemplate(page);
        setSelectedPage(null);
      }
    },
    [requiresConfirmation, handleApplyPageTemplate]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedPage(null);
    setIsConfirming(false);
  }, [setIsConfirming]);

  const handleConfirmDialog = useCallback(() => {
    handleApplyPageTemplate(selectedPage);
    setIsConfirming(false);
  }, [selectedPage, handleApplyPageTemplate]);

  const handleKeyboardPageClick = useCallback(
    ({ key }, page) => {
      if (key === 'Enter') {
        handlePageClick(page);
      }
    },
    [handlePageClick]
  );

  return {
    isConfirming,
    handleCloseDialog,
    handleConfirmDialog,
    handleKeyboardPageClick,
    handlePageClick,
  };
}

export default useTemplateActions;
