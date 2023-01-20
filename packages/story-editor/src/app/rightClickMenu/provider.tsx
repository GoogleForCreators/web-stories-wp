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
import { useGlobalKeyDownEffect } from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import type { PropsWithChildren } from 'react';
import { useCallback, useMemo, useReducer } from '@googleforcreators/react';

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import { PropsWithChildren } from 'react';
import Context from './context';
import rightClickMenuReducer, {
  ACTION_TYPES,
  DEFAULT_RIGHT_CLICK_MENU_STATE,
} from './reducer';
import { useCopyPasteActions } from './hooks';

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

function RightClickMenuProvider({ children }: PropsWithChildren<unknown>) {
  const [{ isMenuOpen, menuPosition }, dispatch] = useReducer(
    rightClickMenuReducer,
    DEFAULT_RIGHT_CLICK_MENU_STATE
  );

  const { handleCopyStyles, handlePasteStyles } = useCopyPasteActions();

  /**
   * Open the menu at the position from the click event.
   *
   * @param {Event} evt The triggering event
   */
  const handleOpenMenu = useCallback((evt: MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    let x = evt?.clientX;
    let y = evt?.clientY;

    // Context menus opened through a shortcut will not have clientX and clientY
    // Instead determine the position of the menu off of the element
    if (!x && !y) {
      const dims = evt.target.getBoundingClientRect();
      x = dims.x;
      y = dims.y;
    }

    dispatch({
      type: ACTION_TYPES.OPEN_MENU,
      payload: { x, y },
    });

    void trackEvent('context_menu_action', {
      name: 'context_menu_opened',
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

  useGlobalKeyDownEffect(
    { key: ['mod+alt+o'] },
    (evt) => {
      evt.preventDefault();
      handleCopyStyles();
    },
    [handleCopyStyles]
  );

  useGlobalKeyDownEffect(
    { key: ['mod+alt+p'] },
    (evt) => {
      evt.preventDefault();
      handlePasteStyles();
    },
    [handlePasteStyles]
  );

  const value = useMemo(
    () => ({
      isMenuOpen,
      menuPosition,
      onCloseMenu: handleCloseMenu,
      onOpenMenu: handleOpenMenu,
    }),
    [handleCloseMenu, handleOpenMenu, isMenuOpen, menuPosition]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default RightClickMenuProvider;
