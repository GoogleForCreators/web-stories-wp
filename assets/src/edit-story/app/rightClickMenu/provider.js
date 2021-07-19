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
import { isPlatformMacOS } from '@web-stories-wp/design-system';

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import { useStory } from '..';
import { ELEMENT_TYPE } from '../highlights/quickActions/constants';
import { duplicatePage } from '../../elements';
import { noop } from '../../utils/noop';
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
    arrangeElement,
    currentPage,
    deleteCurrentPage,
    pages,
    replaceCurrentPage,
    selectedElements,
  } = useStory(
    ({
      state: { currentPage, pages, selectedElements },
      actions: {
        addPage,
        arrangeElement,
        deleteCurrentPage,
        replaceCurrentPage,
      },
    }) => ({
      addPage,
      arrangeElement,
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

  const selectedElement = selectedElements?.[0];

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
  const handleMouseDown = useCallback((evt) => {
    evt.stopPropagation();
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

  const currentPosition = currentPage?.elements.findIndex(
    (element) => element.id === selectedElement?.id
  );
  const canElementMoveBackwards = currentPosition > 1;
  const canElementMoveForwards =
    currentPosition < currentPage?.elements.length - 1;

  /**
   * Send element one layer backwards, if possible.
   */
  const handleSendBackward = useCallback(() => {
    const newPosition =
      currentPosition === 1 ? currentPosition : currentPosition - 1;

    arrangeElement({
      elementId: selectedElement.id,
      position: newPosition,
    });
  }, [arrangeElement, currentPosition, selectedElement?.id]);

  /**
   * Send element all the way back, if possible.
   */
  const handleSendToBack = useCallback(() => {
    arrangeElement({
      elementId: selectedElement.id,
      position: 1,
    });
  }, [arrangeElement, selectedElement?.id]);

  /**
   * Bring element one layer forwards, if possible.
   */
  const handleBringForward = useCallback(() => {
    const newPosition =
      currentPosition >= currentPage.elements.length - 1
        ? currentPosition
        : currentPosition + 1;

    arrangeElement({
      elementId: selectedElement.id,
      position: newPosition,
    });
  }, [arrangeElement, currentPage, currentPosition, selectedElement?.id]);

  /**
   * Send element all the way to the front, if possible.
   */
  const handleBringToFront = useCallback(() => {
    arrangeElement({
      elementId: selectedElement.id,
      position: currentPage.elements.length - 1,
    });
  }, [arrangeElement, currentPage, selectedElement?.id]);

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

  const foregroundMediaItems = useMemo(
    () => [
      ...defaultItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD,
        separator: 'top',
        // TODO: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: {
          display: isMacOs ? '⌥ ⌘ [' : '⌥ ctrl [',
          title: isMacOs
            ? RIGHT_CLICK_MENU_SHORTCUT_LABELS.OPTION_COMMAND_OPEN_BRACKET
            : RIGHT_CLICK_MENU_SHORTCUT_LABELS.OPTION_CONTROL_OPEN_BRACKET,
        },
        disabled: !canElementMoveBackwards,
        onClick: handleSendBackward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
        // TODO: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: {
          display: isMacOs ? '⌘ [' : 'ctrl [',
          title: isMacOs
            ? RIGHT_CLICK_MENU_SHORTCUT_LABELS.COMMAND_OPEN_BRACKET
            : RIGHT_CLICK_MENU_SHORTCUT_LABELS.CONTROL_OPEN_BRACKET,
        },
        disabled: !canElementMoveBackwards,
        onClick: handleSendToBack,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
        // TODO: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: {
          display: isMacOs ? '⌘ ]' : 'ctrl ]',
          title: isMacOs
            ? RIGHT_CLICK_MENU_SHORTCUT_LABELS.COMMAND_CLOSE_BRACKET
            : RIGHT_CLICK_MENU_SHORTCUT_LABELS.CONTROL_CLOSE_BRACKET,
        },
        disabled: !canElementMoveForwards,
        onClick: handleBringForward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
        // TODO: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: {
          display: isMacOs ? '⌥ ⌘ ]' : '⌥ ctrl ]',
          title: isMacOs
            ? RIGHT_CLICK_MENU_SHORTCUT_LABELS.OPTION_COMMAND_CLOSE_BRACKET
            : RIGHT_CLICK_MENU_SHORTCUT_LABELS.OPTION_CONTROL_CLOSE_BRACKET,
        },
        disabled: !canElementMoveForwards,
        onClick: handleBringToFront,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND,
        separator: 'top',
        onClick: noop,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_IMAGE,
        onClick: noop,
        ...menuItemProps,
      },
    ],
    [
      canElementMoveBackwards,
      canElementMoveForwards,
      defaultItems,
      handleBringForward,
      handleBringToFront,
      handleSendBackward,
      handleSendToBack,
      menuItemProps,
    ]
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
      case ELEMENT_TYPE.VIDEO:
        return foregroundMediaItems;
      case ELEMENT_TYPE.SHAPE:
      case ELEMENT_TYPE.TEXT:
      default:
        return pageItems;
    }
  }, [foregroundMediaItems, pageItems, selectedElement?.type]);

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
