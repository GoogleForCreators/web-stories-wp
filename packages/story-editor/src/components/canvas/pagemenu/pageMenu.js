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
import styled from 'styled-components';
import { memo, useCallback, useRef } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { Icons } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { createPage, duplicatePage } from '../../../elements';
import usePerformanceTracking from '../../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../../constants/performanceTrackingEvents';
import PageMenuButton from './pageMenuButton';
import AnimationToggle from './animationToggle';

const Wrapper = styled.div`
  margin-top: auto;
  padding: 0 4px;
`;

function PageMenu() {
  const {
    currentPage,
    numberOfPages,
    deleteCurrentPage,
    addPage,
    hasAnimations,
  } = useStory(
    ({
      state: { currentPage, pages },
      actions: { deleteCurrentPage, addPage },
    }) => {
      return {
        currentPage,
        numberOfPages: pages.length,
        deleteCurrentPage,
        addPage,
        hasAnimations: currentPage?.animations?.length > 0,
      };
    }
  );

  const addPageButtonRef = useRef(null);
  const deletePageButtonRef = useRef(null);

  usePerformanceTracking({
    node: addPageButtonRef.current,
    eventData: TRACKING_EVENTS.PAGE_ADD,
  });
  usePerformanceTracking({
    node: deletePageButtonRef.current,
    eventData: TRACKING_EVENTS.PAGE_DELETE,
  });

  const handleDeletePage = useCallback(
    () => deleteCurrentPage(),
    [deleteCurrentPage]
  );

  const handleAddPage = useCallback(
    () => addPage({ page: createPage() }),
    [addPage]
  );

  const handleDuplicatePage = useCallback(
    () => addPage({ page: duplicatePage(currentPage) }),
    [addPage, currentPage]
  );

  const disableDeleteButton = numberOfPages <= 1;

  if (!currentPage) {
    return null;
  }

  return (
    <Wrapper role="group" aria-label={__('Page actions', 'web-stories')}>
      {hasAnimations && <AnimationToggle />}
      <PageMenuButton
        ref={addPageButtonRef}
        title={__('New Page', 'web-stories')}
        onClick={handleAddPage}
        aria-label={__('Add New Page', 'web-stories')}
      >
        <Icons.PlusOutline />
      </PageMenuButton>
      <PageMenuButton
        title={__('Duplicate Page', 'web-stories')}
        onClick={handleDuplicatePage}
        aria-label={__('Duplicate Page', 'web-stories')}
      >
        <Icons.PagePlus />
      </PageMenuButton>
      <PageMenuButton
        ref={deletePageButtonRef}
        title={__('Delete Page', 'web-stories')}
        disabled={disableDeleteButton}
        onClick={handleDeletePage}
        aria-label={__('Delete Page', 'web-stories')}
      >
        <Icons.Trash />
      </PageMenuButton>
    </Wrapper>
  );
}

// Don't rerender the page menu needlessly e.g. on element selection change.
export default memo(PageMenu);
