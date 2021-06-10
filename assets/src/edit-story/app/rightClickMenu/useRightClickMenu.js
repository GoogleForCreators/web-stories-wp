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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '..';
import { noop } from '../../utils/noop';
import { ELEMENT_TYPE } from '../highlights/quickActions/constants';
import { RIGHT_CLICK_MENU_LABELS } from './constants';

/** @typedef {import('../../../../design-system/components').MenuItemProps} MenuItemProps */

/**
 * Determines the items displayed in the right click menu
 * based off of the right-clicked element.
 *
 * Right click menu items should have the same shape as items
 * in the design system's context menu.
 *
 * @return {Array.<MenuItemProps>} an array of right click menu item objects
 */
const useRightClickMenu = () => {
  const { selectedElements } = useStory(
    ({
      state: { currentPage, selectedElements, selectedElementAnimations },
    }) => ({
      currentPage,
      selectedElements,
      selectedElementAnimations,
    })
  );

  // Ref to use to calculate the menu's position
  const rightClickAreaRef = useRef();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  /**
   * Open the menu at the position from the click event.
   */
  const handleOpenMenu = useCallback((evt) => {
    evt.preventDefault();
    const layoutRect = rightClickAreaRef?.current?.getBoundingClientRect();

    if (layoutRect) {
      setMenuPosition({
        x: evt.clientX - layoutRect?.left,
        y: evt.clientY - layoutRect?.top,
      });

      setIsMenuOpen(true);
    }
  }, []);

  /**
   * Close the menu and reset the tracked position.
   */
  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
    setMenuPosition({ x: 0, y: 0 });
  }, []);

  /**
   * Prevent right click menu from removing focus from the canvas.
   */
  const handleMouseDown = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  const selectedElement = selectedElements?.[0];

  const menuItemProps = useMemo(
    () => ({
      handleMouseDown,
    }),
    [handleMouseDown]
  );

  const defaultItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY,
        shortcut: '⌘ X',
        onClick: noop,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE,
        shortcut: '⌘ V',
        onClick: noop,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE,
        shortcut: 'DEL',
        onClick: noop,
        ...menuItemProps,
      },
    ],
    [menuItemProps]
  );

  const pageItems = useMemo(
    () => [
      ...defaultItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        onClick: noop,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
        onClick: noop,
        ...menuItemProps,
      },
    ],
    [defaultItems, menuItemProps]
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

  // Override the browser's context menu
  useEffect(() => {
    // document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleOpenMenu);
    return () => {
      // document.addEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleOpenMenu);
    };
  });

  return {
    isMenuOpen,
    menuItems,
    menuPosition,
    onCloseMenu: handleCloseMenu,
    onOpenMenu: handleOpenMenu,
    rightClickAreaRef,
  };
};

export default useRightClickMenu;
