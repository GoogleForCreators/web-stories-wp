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
import PropTypes from 'prop-types';
import { useCallback, useMemo, useReducer } from '@googleforcreators/react';

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import useStory from '../story/useStory';
import { useLocalMedia } from '../media';
import { ELEMENT_TYPES } from '../../elements';
import useVideoTrim from '../../components/videoTrim/useVideoTrim';
import {
  RIGHT_CLICK_MENU_LABELS,
  RIGHT_CLICK_MENU_SHORTCUTS,
} from './constants';
import Context from './context';
import rightClickMenuReducer, {
  ACTION_TYPES,
  DEFAULT_RIGHT_CLICK_MENU_STATE,
} from './reducer';
import useLayerSelect from './useLayerSelect';
import {
  useCopyPasteActions,
  useElementActions,
  useLayerActions,
  usePageActions,
  usePresetActions,
} from './hooks';

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
  const { currentPageIndex, pages, selectedElements } = useStory(
    ({ state: { currentPageIndex, pages, selectedElements } }) => ({
      currentPageIndex,
      pages,
      selectedElements,
    })
  );

  const { canTranscodeResource } = useLocalMedia(
    ({ state: { canTranscodeResource } }) => ({
      canTranscodeResource,
    })
  );

  const { hasTrimMode, toggleTrimMode } = useVideoTrim(
    ({ state: { hasTrimMode }, actions: { toggleTrimMode } }) => ({
      hasTrimMode,
      toggleTrimMode,
    })
  );

  const [{ isMenuOpen, menuPosition }, dispatch] = useReducer(
    rightClickMenuReducer,
    DEFAULT_RIGHT_CLICK_MENU_STATE
  );

  // Right Click Actions
  const {
    canElementMoveBackwards,
    canElementMoveForwards,
    onBringForward,
    onBringToFront,
    onSendBackward,
    onSendToBack,
  } = useLayerActions();
  const { onAddPageAtPosition, onDuplicatePage, onDeletePage } =
    usePageActions();
  const {
    onDuplicateSelectedElements,
    onOpenScaleAndCrop,
    onSetPageBackground,
    onRemovePageBackground,
  } = useElementActions();
  const { onAddTextPreset, onAddColorPreset } = usePresetActions();
  const { copiedElementType, onCopyStyles, onPasteStyles } =
    useCopyPasteActions();

  const selectedElement = selectedElements?.[0];

  /**
   * Open the menu at the position from the click event.
   *
   * @param {Event} evt The triggering event
   */
  const handleOpenMenu = useCallback((evt) => {
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

    trackEvent('context_menu_action', {
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

  /**
   * Prevent right click menu from removing focus from the canvas.
   *
   * @param {Event} evt The triggering event
   */
  const handleMouseDown = useCallback((evt) => {
    evt.stopPropagation();
  }, []);

  const menuItemProps = useMemo(
    () => ({
      onMouseDown: handleMouseDown,
    }),
    [handleMouseDown]
  );

  const layerItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.SEND_BACKWARD,
        disabled: !canElementMoveBackwards,
        onClick: onSendBackward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.SEND_TO_BACK,
        disabled: !canElementMoveBackwards,
        onClick: onSendToBack,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.BRING_FORWARD,
        disabled: !canElementMoveForwards,
        onClick: onBringForward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.BRING_TO_FRONT,
        disabled: !canElementMoveForwards,
        onClick: onBringToFront,
        ...menuItemProps,
      },
    ],
    [
      canElementMoveBackwards,
      canElementMoveForwards,
      onBringForward,
      onBringToFront,
      onSendBackward,
      onSendToBack,
      menuItemProps,
    ]
  );

  const pageManipulationItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER,
        onClick: () => onAddPageAtPosition(currentPageIndex + 1),
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE,
        onClick: () => onAddPageAtPosition(currentPageIndex),
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        onClick: onDuplicatePage,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
        onClick: onDeletePage,
        disabled: pages.length === 1,
        ...menuItemProps,
      },
    ],
    [
      currentPageIndex,
      onAddPageAtPosition,
      onDeletePage,
      onDuplicatePage,
      menuItemProps,
      pages,
    ]
  );

  const layerSelectItem = useLayerSelect({
    menuItemProps,
    menuPosition,
    isMenuOpen,
  });

  const pageItems = useMemo(() => {
    const disableBackgroundMediaActions = selectedElement?.isDefaultBackground;
    const isVideo = selectedElement?.type === 'video';
    const detachLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.DETACH_VIDEO_FROM_BACKGROUND
      : RIGHT_CLICK_MENU_LABELS.DETACH_IMAGE_FROM_BACKGROUND;
    const scaleLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_VIDEO
      : RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_IMAGE;

    const showTrimModeAction = isVideo && hasTrimMode;

    const items = [
      {
        label: detachLabel,
        onClick: onRemovePageBackground,
        disabled: disableBackgroundMediaActions,
        ...menuItemProps,
      },
      {
        label: scaleLabel,
        onClick: onOpenScaleAndCrop,
        disabled: disableBackgroundMediaActions,
        separator: showTrimModeAction ? undefined : 'bottom',
        ...menuItemProps,
      },
      ...(showTrimModeAction
        ? [
            {
              label: RIGHT_CLICK_MENU_LABELS.TRIM_VIDEO,
              onClick: toggleTrimMode,
              disabled: !canTranscodeResource(selectedElement?.resource),
              separator: showTrimModeAction ? 'bottom' : undefined,
              ...menuItemProps,
            },
          ]
        : []),
      ...pageManipulationItems,
    ];
    if (layerSelectItem) {
      return [layerSelectItem, ...items];
    }
    return items;
  }, [
    canTranscodeResource,
    hasTrimMode,
    layerSelectItem,
    menuItemProps,
    onOpenScaleAndCrop,
    onRemovePageBackground,
    pageManipulationItems,
    selectedElement,
    toggleTrimMode,
  ]);

  const textItems = useMemo(() => {
    const items = [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: onDuplicateSelectedElements,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY_STYLES,
        separator: 'top',
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        onClick: onCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_STYLES,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
        onClick: onPasteStyles,
        disabled: copiedElementType !== selectedElement?.type,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_TO_TEXT_PRESETS,
        onClick: onAddTextPreset,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS,
        onClick: onAddColorPreset,
        ...menuItemProps,
      },
    ];
    if (layerSelectItem) {
      return [layerSelectItem, ...items];
    }
    return items;
  }, [
    copiedElementType,
    layerItems,
    layerSelectItem,
    menuItemProps,
    onAddColorPreset,
    onAddTextPreset,
    onCopyStyles,
    onDuplicateSelectedElements,
    onPasteStyles,
    selectedElement,
    selectedElements.length,
  ]);

  const foregroundMediaItems = useMemo(() => {
    const isVideo = selectedElement?.type === 'video';
    const scaleLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_VIDEO
      : RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_IMAGE;
    const copyLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.COPY_VIDEO_STYLES
      : RIGHT_CLICK_MENU_LABELS.COPY_IMAGE_STYLES;
    const pasteLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.PASTE_VIDEO_STYLES
      : RIGHT_CLICK_MENU_LABELS.PASTE_IMAGE_STYLES;

    const items = [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: onDuplicateSelectedElements,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND,
        separator: 'top',
        onClick: onSetPageBackground,
        ...menuItemProps,
      },
      {
        label: scaleLabel,
        onClick: onOpenScaleAndCrop,
        ...menuItemProps,
      },
      ...(isVideo && hasTrimMode
        ? [
            {
              label: RIGHT_CLICK_MENU_LABELS.TRIM_VIDEO,
              onClick: toggleTrimMode,
              disabled: !canTranscodeResource(selectedElement?.resource),
              ...menuItemProps,
            },
          ]
        : []),
      {
        label: copyLabel,
        separator: 'top',
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        onClick: onCopyStyles,
        ...menuItemProps,
      },
      {
        label: pasteLabel,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
        onClick: onPasteStyles,
        disabled: copiedElementType !== selectedElement?.type,
        ...menuItemProps,
      },
    ];
    if (layerSelectItem) {
      return [layerSelectItem, ...items];
    }
    return items;
  }, [
    canTranscodeResource,
    copiedElementType,
    hasTrimMode,
    layerItems,
    layerSelectItem,
    menuItemProps,
    onCopyStyles,
    onDuplicateSelectedElements,
    onOpenScaleAndCrop,
    onPasteStyles,
    onSetPageBackground,
    selectedElement,
    selectedElements.length,
    toggleTrimMode,
  ]);

  const shapeItems = useMemo(() => {
    const items = [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: onDuplicateSelectedElements,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY_SHAPE_STYLES,
        separator: 'top',
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        onClick: onCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_SHAPE_STYLES,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
        onClick: onPasteStyles,
        disabled: copiedElementType !== selectedElement?.type,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS,
        onClick: onAddColorPreset,
        ...menuItemProps,
      },
    ];
    if (layerSelectItem) {
      return [layerSelectItem, ...items];
    }
    return items;
  }, [
    copiedElementType,
    layerItems,
    layerSelectItem,
    menuItemProps,
    onAddColorPreset,
    onCopyStyles,
    onDuplicateSelectedElements,
    onPasteStyles,
    selectedElement?.type,
    selectedElements.length,
  ]);

  const stickerItems = useMemo(() => {
    const items = [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: onDuplicateSelectedElements,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...layerItems,
    ];
    if (layerSelectItem) {
      return [layerSelectItem, ...items];
    }
    return items;
  }, [
    layerItems,
    layerSelectItem,
    menuItemProps,
    onDuplicateSelectedElements,
    selectedElements.length,
  ]);

  const multipleElementItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: onDuplicateSelectedElements,
        ...menuItemProps,
      },
    ],
    [menuItemProps, onDuplicateSelectedElements, selectedElements.length]
  );

  const menuItems = useMemo(() => {
    if (selectedElements.length > 1) {
      return multipleElementItems;
    }

    if (selectedElement?.isDefaultBackground) {
      return pageItems;
    }

    switch (selectedElement?.type) {
      case ELEMENT_TYPES.IMAGE:
      case ELEMENT_TYPES.VIDEO:
      case ELEMENT_TYPES.GIF:
        return selectedElement?.isBackground ? pageItems : foregroundMediaItems;
      case ELEMENT_TYPES.SHAPE:
        return shapeItems;
      case ELEMENT_TYPES.TEXT:
        return textItems;
      case ELEMENT_TYPES.STICKER:
        return stickerItems;
      default:
        return pageItems;
    }
  }, [
    foregroundMediaItems,
    multipleElementItems,
    pageItems,
    selectedElement,
    selectedElements.length,
    shapeItems,
    stickerItems,
    textItems,
  ]);

  useGlobalKeyDownEffect(
    { key: ['mod+alt+o'] },
    (evt) => {
      evt.preventDefault();
      onCopyStyles();
    },
    [onCopyStyles]
  );

  useGlobalKeyDownEffect(
    { key: ['mod+alt+p'] },
    (evt) => {
      evt.preventDefault();
      onPasteStyles();
    },
    [onPasteStyles]
  );

  const value = useMemo(
    () => ({
      isMenuOpen,
      menuItems,
      menuPosition,
      onCloseMenu: handleCloseMenu,
      onOpenMenu: handleOpenMenu,
    }),
    [handleCloseMenu, handleOpenMenu, isMenuOpen, menuItems, menuPosition]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

RightClickMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RightClickMenuProvider;
