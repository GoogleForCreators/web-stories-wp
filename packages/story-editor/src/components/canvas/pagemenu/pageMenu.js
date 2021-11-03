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
import { __, sprintf } from '@web-stories-wp/i18n';
import { Icons, Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useStory, useHistory, useConfig, useLayout } from '../../../app';
import { createPage, duplicatePage } from '../../../elements';
import usePerformanceTracking from '../../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../../constants/performanceTrackingEvents';
import PageMenuButton from './pageMenuButton';
import AnimationToggle from './animationToggle';

const DIVIDER_HEIGHT = 16;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  --pagemenu-icon-space: ${({ isWidePage }) => (isWidePage ? 16 : 10)}px;
  --pagemenu-count-space: ${({ isWidePage }) => (isWidePage ? 24 : 12)}px;
`;

const Divider = styled.span`
  background-color: ${({ theme }) => theme.colors.bg.tertiary};
  opacity: 0.3;
  height: ${DIVIDER_HEIGHT}px;
  width: 1px;
`;

const CountSpace = styled.div`
  width: var(--pagemenu-count-space);
`;

const IconSpace = styled.div`
  width: var(--pagemenu-icon-space);
`;

function PageMenu() {
  const {
    state: { canUndo, canRedo },
    actions: { undo, redo },
  } = useHistory();
  const {
    currentPageNumber,
    currentPage,
    numberOfPages,
    deleteCurrentPage,
    addPage,
    hasAnimations,
  } = useStory(
    ({
      state: { currentPageNumber, currentPage, pages },
      actions: { deleteCurrentPage, addPage },
    }) => {
      return {
        currentPageNumber,
        currentPage,
        numberOfPages: pages.length,
        deleteCurrentPage,
        addPage,
        hasAnimations: currentPage?.animations?.length > 0,
      };
    }
  );
  const { pageWidth } = useLayout((state) => ({
    pageWidth: state.state.pageWidth,
  }));
  const { isRTL } = useConfig();

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

  const isWidePage = pageWidth > 280;
  const disableDeleteButton = numberOfPages <= 1;

  const handleUndo = useCallback(() => undo(), [undo]);

  const handleRedo = useCallback(() => redo(), [redo]);

  if (!currentPage) {
    return null;
  }

  return (
    <Wrapper isWidePage={isWidePage}>
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
        {sprintf(
          /* translators: %s: page number. */
          __('Page %s', 'web-stories'),
          currentPageNumber
        )}
      </Text>
      <CountSpace />
      <PageMenuButton
        ref={deletePageButtonRef}
        title={__('Delete Page', 'web-stories')}
        disabled={disableDeleteButton}
        onClick={handleDeletePage}
        aria-label={__('Delete Page', 'web-stories')}
      >
        <Icons.Trash />
      </PageMenuButton>
      <IconSpace />
      <PageMenuButton
        title={__('Duplicate Page', 'web-stories')}
        onClick={handleDuplicatePage}
        aria-label={__('Duplicate Page', 'web-stories')}
      >
        <Icons.PagePlus />
      </PageMenuButton>
      <IconSpace />
      <PageMenuButton
        ref={addPageButtonRef}
        title={__('New Page', 'web-stories')}
        onClick={handleAddPage}
        aria-label={__('Add New Page', 'web-stories')}
      >
        <Icons.PlusOutline />
      </PageMenuButton>
      <IconSpace />
      <Divider />
      <IconSpace />
      <PageMenuButton
        title={__('Undo', 'web-stories')}
        shortcut="mod+z"
        disabled={!canUndo}
        onClick={handleUndo}
        aria-label={__('Undo Changes', 'web-stories')}
      >
        {isRTL ? <Icons.ArrowDownRightCurved /> : <Icons.ArrowDownLeftCurved />}
      </PageMenuButton>
      <IconSpace />
      <PageMenuButton
        title={__('Redo', 'web-stories')}
        shortcut="shift+mod+z"
        disabled={!canRedo}
        onClick={handleRedo}
        aria-label={__('Redo Changes', 'web-stories')}
      >
        {isRTL ? <Icons.ArrowDownLeftCurved /> : <Icons.ArrowDownRightCurved />}
      </PageMenuButton>
      {hasAnimations && (
        <>
          <IconSpace />
          <Divider />
          <IconSpace />
          <AnimationToggle />
        </>
      )}
    </Wrapper>
  );
}

// Don't rerender the page menu needlessly e.g. on element selection change.
export default memo(PageMenu);
