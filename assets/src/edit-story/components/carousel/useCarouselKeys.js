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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import {
  useEscapeToBlurEffect,
  useKeyDownEffect,
} from '../../../design-system';
import { useStory, useConfig } from '../../app';
import { duplicatePage } from '../../elements';

function useCarouselKeys({ listElement, pageRefs }) {
  const { isRTL } = useConfig();
  const {
    addPageAt,
    arrangePage,
    currentPage,
    currentPageId,
    deletePage,
    pages,
    setCurrentPage,
  } = useStory(
    ({
      state: { pages, currentPage, currentPageId },
      actions: { addPageAt, arrangePage, deletePage, setCurrentPage },
    }) => ({
      addPageAt,
      arrangePage,
      currentPage,
      currentPageId,
      deletePage,
      pages,
      setCurrentPage,
    })
  );

  const pageIds = useMemo(() => pages.map(({ id }) => id), [pages]);

  useEscapeToBlurEffect(listElement, [listElement]);

  // Navigate left and right.
  useKeyDownEffect(
    listElement,
    { key: ['up', 'down', 'left', 'right'] },
    ({ key }) => {
      // Intercept all keys, but only handle left and right.
      const dir = getArrowDir(key, 'ArrowRight', 'ArrowLeft', isRTL);
      if (dir === 0) {
        return;
      }
      const index = pageIds.indexOf(currentPageId);
      const nextIndex = index + dir;
      if (nextIndex >= 0 && nextIndex < pageIds.length) {
        const pageId = pageIds[nextIndex];
        setCurrentPage({ pageId });

        const thumbnail = pageRefs.current && pageRefs.current[pageId];
        // @todo: provide a cleaner `focusFirst()` API and takes into account
        // `tabIndex`, `disabled`, links, buttons, inputs, etc.
        const button = thumbnail?.querySelector('button');
        if (button) {
          button.focus();
        }
      }
    },
    [currentPageId, isRTL, pageIds, setCurrentPage, pageRefs]
  );

  // Rearrange pages.
  useKeyDownEffect(
    listElement,
    { key: ['mod+up', 'mod+down', 'mod+left', 'mod+right'], shift: true },
    (evt) => {
      const { key, shiftKey } = evt;

      // Cancel the default behavior of the event: it's very jarring to run
      // into mod+left/right triggering the browser's back/forward navigation.
      evt.preventDefault();

      // Intercept all keys, but only handle left and right.
      const dir = getArrowDir(key, 'ArrowRight', 'ArrowLeft', isRTL);
      if (dir === 0) {
        return;
      }
      const index = pageIds.indexOf(currentPageId);
      let newPos = index;
      if (shiftKey) {
        newPos = dir < 0 ? 0 : pageIds.length - 1;
      } else {
        newPos = index + dir;
      }
      if (newPos !== index && newPos >= 0 && newPos < pageIds.length) {
        arrangePage({ pageId: currentPageId, position: newPos });
      }
    },
    [arrangePage, currentPageId, isRTL, pageIds, setCurrentPage]
  );

  // Delete the current page.
  useKeyDownEffect(
    listElement,
    'delete',
    () => {
      deletePage({ pageId: currentPageId });

      // Wait for active page to change, then set new active page as focus
      const currentElement = document.activeElement;
      const setFocusWhenActiveElementChanges = () => {
        if (document.activeElement !== currentElement) {
          // Find the new active element (an option with tabindex=0)
          const focusableOption = listElement.querySelector(
            '[role="option"][tabindex="0"]'
          );
          // If exists, set focus
          if (focusableOption) {
            focusableOption.focus();
            return;
          }
        }
        // Otherwise, try again in 100ms
        setTimeout(setFocusWhenActiveElementChanges, 100);
      };
      setFocusWhenActiveElementChanges();
    },
    [currentPageId, deletePage, listElement]
  );

  // Clone the current page.
  useKeyDownEffect(
    listElement,
    'clone',
    () => {
      const index = pageIds.indexOf(currentPage.id);
      addPageAt({ page: duplicatePage(currentPage), position: index + 1 });
    },
    [addPageAt, currentPage, pageIds]
  );
}

function getArrowDir(key, pos, neg, isRTL) {
  const rtlDir = isRTL ? -1 : 1;
  if (key === pos) {
    return rtlDir;
  }
  if (key === neg) {
    return -rtlDir;
  }
  return 0;
}

export default useCarouselKeys;
