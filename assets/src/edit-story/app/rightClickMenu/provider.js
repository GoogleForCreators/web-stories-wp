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
import { useFeature } from 'flagged';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import { useStory } from '..';
import { ELEMENT_TYPE } from '../highlights/quickActions/constants';
import { duplicatePage } from '../../elements';
import { isPlatformMacOS } from '@web-stories-wp/design-system';
import {
  RIGHT_CLICK_MENU_LABELS,
  RIGHT_CLICK_MENU_SHORTCUT_LABELS,
} from './constants';
import Context from './context';
import rightClickMenuReducer, {
  ACTION_TYPES,
  DEFAULT_RIGHT_CLICK_MENU_STATE,
} from './reducer';

const isMacOs = isPlatformMacOS();

/**
 * Determines the items displayed in the right click menu
 * based off of the right-clicked element.
 *
 * Right click menu items should have the same shape as items
 * in the design system's context menu.
 *
 * @param {Object} root0 props for the provider
 * @param {Node} root0.children the children to be rendered
 * @return {Node} React node
 */
function RightClickMenuProvider({ children }) {
  const enableRightClickMenus = useFeature('enableRightClickMenus');

  const {
    addPage,
    currentPage,
    deleteCurrentPage,
    pages,
    replaceCurrentPage,
    selectedElements,
  } = useStory(
    ({
      state: { currentPage, pages, selectedElements },
      actions: { addPage, deleteCurrentPage, replaceCurrentPage },
    }) => ({
      addPage,
      currentPage,
      deleteCurrentPage,
      pages,
      replaceCurrentPage,
      selectedElements,
    })
  );

  // Ref for attaching the context menu
  const rightClickAreaRef = useRef();

  const [{ copiedPage, isMenuOpen, menuPosition }, dispatch] = useReducer(
    rightClickMenuReducer,
    DEFAULT_RIGHT_CLICK_MENU_STATE
  );

  /**
   * Open the menu at the position from the click event.
   */
  const handleOpenMenu = useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    dispatch({
      type: ACTION_TYPES.OPEN_MENU,
      payload: {
        x: evt?.offsetX,
        y: evt?.offsetY,
      },
    });
  }, []);

  /**
   * Close the menu and reset the tracked position.
   */
  const handleCloseMenu = useCallback(() => {
    if (isMenuOpen) {
      dispatch({ type: ACTION_TYPES.CLOSE_MENU });
    }
  }, [isMenuOpen]);

  /**
   * Prevent right click menu from removing focus from the canvas.
   */
  const handleMouseDown = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  /**
   * Copy the page to state.
   */
  const handleCopyPage = useCallback(() => {
    dispatch({ type: ACTION_TYPES.COPY_PAGE, payload: currentPage });
  }, [currentPage]);

  /**
   * Paste the copied page from state if one exists.
   */
  const handlePastePage = useCallback(() => {
    if (copiedPage) {
      replaceCurrentPage({ page: copiedPage });
      dispatch({ type: ACTION_TYPES.RESET });
    }
  }, [replaceCurrentPage, copiedPage]);

  /**
   * Duplicate the current page.
   */
  const handleDuplicatePage = useCallback(() => {
    addPage({ page: duplicatePage(currentPage) });
  }, [addPage, currentPage]);

  /**
   * Delete the current page.
   */
  const handleDeletePage = useCallback(() => {
    deleteCurrentPage();
  }, [deleteCurrentPage]);

  const selectedElement = selectedElements?.[0];

  const menuItemProps = useMemo(
    () => ({
      onMouseDown: handleMouseDown,
    }),
    [handleMouseDown]
  );

  const defaultItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY,
        shortcut: {
          display: isMacOs ? '⌘ C' : 'ctrl C',
          title: isMacOs
            ? RIGHT_CLICK_MENU_SHORTCUT_LABELS.COMMAND_C
            : RIGHT_CLICK_MENU_SHORTCUT_LABELS.CONTROL_C,
        },
        onClick: handleCopyPage,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE,
        shortcut: {
          display: isMacOs ? '⌘ V' : 'ctrl V',
          title: isMacOs
            ? RIGHT_CLICK_MENU_SHORTCUT_LABELS.COMMAND_V
            : RIGHT_CLICK_MENU_SHORTCUT_LABELS.CONTROL_V,
        },
        onClick: handlePastePage,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE,
        shortcut: {
          display: 'DEL',
          title: RIGHT_CLICK_MENU_SHORTCUT_LABELS.DELETE,
        },
        onClick: handleDeletePage,
        ...menuItemProps,
      },
    ],
    [handleCopyPage, menuItemProps, handleDeletePage, handlePastePage]
  );

  const pageItems = useMemo(
    () => [
      ...defaultItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        onClick: handleDuplicatePage,
        separator: 'top',
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
        onClick: handleDeletePage,
        disabled: pages.length === 1,
        ...menuItemProps,
      },
    ],
    [defaultItems, handleDeletePage, handleDuplicatePage, menuItemProps, pages]
  );

  const menuItems = useMemo(() => {
    switch (selectedElement?.type) {
      case ELEMENT_TYPE.IMAGE:
      case ELEMENT_TYPE.SHAPE:
      case ELEMENT_TYPE.TEXT:
      case ELEMENT_TYPE.VIDEO:
      default:
        return pageItems;
    }
  }, [pageItems, selectedElement?.type]);

  // Override the browser's context menu if the
  // rightClickAreaRef is set
  useEffect(() => {
    const node = rightClickAreaRef.current;
    if (!enableRightClickMenus || !node) {
      return undefined;
    }

    node.addEventListener('contextmenu', handleOpenMenu);

    return () => {
      node.removeEventListener('contextmenu', handleOpenMenu);
    };
  }, [enableRightClickMenus, handleOpenMenu]);

  const value = useMemo(
    () => ({
      isMenuOpen,
      menuItems,
      menuPosition,
      onCloseMenu: handleCloseMenu,
      onOpenMenu: handleOpenMenu,
      rightClickAreaRef,
    }),
    [
      handleCloseMenu,
      handleOpenMenu,
      isMenuOpen,
      menuItems,
      menuPosition,
      rightClickAreaRef,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

RightClickMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RightClickMenuProvider;
