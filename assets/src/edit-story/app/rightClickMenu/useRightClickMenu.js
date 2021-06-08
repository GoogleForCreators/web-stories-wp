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
import { useCallback, useMemo, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '..';
import { createClipboardEvent } from '../../utils/copyPaste';
import { noop } from '../../utils/noop';
import { useCanvas } from '../canvas';
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
  const clipboardData = useRef(null);
  const { copyCutHandler, pasteHandler } = useCanvas(
    ({ actions: { copyCutHandler, pasteHandler } }) => ({
      copyCutHandler,
      pasteHandler,
    })
  );
  const { selectedElements } = useStory(({ state: { selectedElements } }) => ({
    selectedElements,
  }));

  /**
   * Prevent right click menu from removing focus from the canvas.
   */
  const handleMouseDown = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  const copyElement = useCallback(() => {
    const clipboardEvent = createClipboardEvent('copy');

    // Won't work in internet explorer. Clipboard events
    // are not supported.
    if (clipboardEvent) {
      const evt = copyCutHandler(clipboardEvent);
      // Need to copy event dude wow.
      document.dispatchEvent(evt);
    }
  }, [copyCutHandler]);

  const pasteElement = useCallback(() => {
    const clipboardEvent = createClipboardEvent(
      'paste',
      clipboardData.current?.clipboardData
    );

    if (clipboardEvent) {
      pasteHandler(clipboardEvent);
    }
  }, [pasteHandler]);

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

  switch (selectedElement?.type) {
    case ELEMENT_TYPE.IMAGE:
    case ELEMENT_TYPE.SHAPE:
    case ELEMENT_TYPE.TEXT:
    case ELEMENT_TYPE.VIDEO:
    default:
      return pageItems;
  }
};

export default useRightClickMenu;
