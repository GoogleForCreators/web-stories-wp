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
import { useMemo } from 'react';

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
  const { selectedElements } = useStory(({ state: { selectedElements } }) => ({
    selectedElements,
  }));

  const selectedElement = selectedElements?.[0];

  const defaultItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY,
        shortcut: '⌘ X',
        onClick: noop,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE,
        shortcut: '⌘ V',
        onClick: noop,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE,
        shortcut: 'DEL',
        onClick: noop,
      },
    ],
    []
  );

  const pageItems = useMemo(
    () => [
      ...defaultItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        onClick: noop,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
        onClick: noop,
      },
    ],
    [defaultItems]
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
