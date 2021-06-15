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
import { noop } from '../../utils/noop';
import { ELEMENT_TYPE } from '../highlights/quickActions/constants';
import { serializeTextAndHTMLData } from '../../utils/copyPaste';
import { useCanvas } from '../canvas';
import { RIGHT_CLICK_MENU_LABELS } from './constants';
import rightClickMenuReducer, {
  ACTION_TYPES,
  DEFAULT_RIGHT_CLICK_MENU_STATE,
} from './reducer';

import Context from './context';

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

  const { pasteHandler } = useCanvas(({ actions: { pasteHandler } }) => ({
    pasteHandler,
  }));
  const { selectedElements, currentPage, selectedElementAnimations } = useStory(
    ({
      state: { currentPage, selectedElements, selectedElementAnimations },
    }) => ({
      currentPage,
      selectedElements,
      selectedElementAnimations,
    })
  );

  // Ref for attaching the context menu
  const rightClickAreaRef = useRef();

  const [{ isMenuOpen, menuPosition }, dispatch] = useReducer(
    rightClickMenuReducer,
    DEFAULT_RIGHT_CLICK_MENU_STATE
  );

  const copyElement = useCallback(async () => {
    if (!selectedElements.length) {
      return;
    }

    const { htmlContent, serializedPayload } = serializeTextAndHTMLData(
      currentPage,
      selectedElements,
      selectedElementAnimations
    );

    try {
      await navigator.clipboard.writeText(
        `<!-- ${serializedPayload} -->${htmlContent}`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('trouble copying the dooby dooby doos', { error });
    }
  }, [currentPage, selectedElements, selectedElementAnimations]);

  const pasteElement = useCallback(async () => {
    let content;
    try {
      content = await navigator.clipboard.readText();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('trouble pasting the dooby dooby doos', { error });
    }

    if (content) {
      pasteHandler(content);
    }
  }, [pasteHandler]);

  /**
   * Open the menu at the position from the click event.
   */
  const handleOpenMenu = useCallback((evt) => {
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
      dispatch({ type: ACTION_TYPES.RESET });
    }
  }, [isMenuOpen]);

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
        onClick: copyElement,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE,
        shortcut: '⌘ V',
        onClick: pasteElement,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE,
        shortcut: 'DEL',
        onClick: noop,
        ...menuItemProps,
      },
    ],
    [copyElement, menuItemProps, pasteElement]
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
