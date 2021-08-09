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
import { v4 as uuidv4 } from 'uuid';

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import { useStory } from '..';
import { createPage, duplicatePage } from '../../elements';
import updateProperties from '../../components/inspector/design/updateProperties';
import { useCanvas } from '../canvas';
import { ELEMENT_TYPES } from '../story';
import { states, useHighlights } from '../highlights';
import useAddPreset from '../../components/panels/design/preset/useAddPreset';
import { PRESET_TYPES } from '../../components/panels/design/preset/constants';
import {
  RIGHT_CLICK_MENU_LABELS,
  RIGHT_CLICK_MENU_SHORTCUTS,
} from './constants';
import Context from './context';
import rightClickMenuReducer, {
  ACTION_TYPES,
  DEFAULT_RIGHT_CLICK_MENU_STATE,
} from './reducer';
import { getDefaultPropertiesForType } from './utils';

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

  const { addGlobalPreset: handleAddColorPreset } = useAddPreset({
    presetType: PRESET_TYPES.COLOR,
  });
  const { setEditingElement } = useCanvas(({ actions }) => ({
    setEditingElement: actions.setEditingElement,
  }));
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));
  const {
    addAnimations,
    addPage,
    addPageAt,
    arrangeElement,
    clearBackgroundElement,
    currentPage,
    currentPageIndex,
    deleteCurrentPage,
    pages,
    replaceCurrentPage,
    setBackgroundElement,
    selectedElements,
    selectedElementAnimations,
    updateElementsById,
  } = useStory(
    ({
      state: {
        currentPage,
        currentPageIndex,
        pages,
        selectedElementAnimations,
        selectedElements,
      },
      actions: {
        addAnimations,
        addPage,
        addPageAt,
        arrangeElement,
        clearBackgroundElement,
        deleteCurrentPage,
        replaceCurrentPage,
        setBackgroundElement,
        updateElementsById,
      },
    }) => ({
      addAnimations,
      addPage,
      addPageAt,
      arrangeElement,
      clearBackgroundElement,
      currentPage,
      currentPageIndex,
      deleteCurrentPage,
      pages,
      replaceCurrentPage,
      selectedElementAnimations,
      selectedElements,
      setBackgroundElement,
      updateElementsById,
    })
  );

  // Ref for attaching the context menu
  const rightClickAreaRef = useRef();

  const [{ copiedElement, copiedPage, isMenuOpen, menuPosition }, dispatch] =
    useReducer(rightClickMenuReducer, DEFAULT_RIGHT_CLICK_MENU_STATE);

  const selectedElement = selectedElements?.[0];
  const currentPosition = currentPage?.elements.findIndex(
    (element) => element.id === selectedElement?.id
  );
  const canElementMoveBackwards = currentPosition > 1;
  const canElementMoveForwards =
    currentPosition < currentPage?.elements.length - 1;

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
   * Adds a new page at the designated index.
   *
   * Defaults to adding the new page after all of the existing pages.
   *
   * @param {number} index The index
   */
  const handleAddPageAtPosition = useCallback(
    (index) => {
      const position = Boolean(index) || index === 0 ? index : pages.length - 1;

      addPageAt({ page: createPage(), position });
    },
    [addPageAt, pages?.length]
  );

  /**
   * Delete the current page.
   */
  const handleDeletePage = useCallback(() => {
    deleteCurrentPage();
  }, [deleteCurrentPage]);

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

  /**
   * Set element as the element being 'edited'.
   */
  const handleOpenScaleAndCrop = useCallback(
    (evt) => {
      setEditingElement(selectedElement?.id, evt);
    },
    [selectedElement?.id, setEditingElement]
  );

  /**
   * Copy the styles and animations of the selected element.
   */
  const handleCopyStyles = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.COPY_ELEMENT_STYLES,
      payload: {
        element: selectedElement,
        animations: selectedElementAnimations,
      },
    });
  }, [selectedElement, selectedElementAnimations]);

  /**
   * Update the selected element's styles and animations.
   *
   * Pasting is not allowed if the copied element styles are from a
   * different element type.
   */
  const handlePasteStyles = useCallback(() => {
    const id = selectedElement?.id;

    if (!id || selectedElement?.type !== copiedElement.type) {
      return;
    }

    // Delete old animation if one exists
    const oldAnimationToDelete = selectedElementAnimations.length
      ? { ...selectedElementAnimations[0], delete: true }
      : undefined;

    // Create new animations
    const newAnimations = copiedElement.animations.map((animation) => ({
      ...animation,
      id: uuidv4(),
      targets: [selectedElement.id],
    }));

    // Add styles and animations to element
    updateElementsById({
      elementIds: [selectedElement.id],
      properties: (currentProperties) =>
        updateProperties(
          currentProperties,
          {
            ...copiedElement.styles,
            animation: oldAnimationToDelete,
          },
          /* commitValues */ true
        ),
    });
    addAnimations({ animations: newAnimations });
  }, [
    addAnimations,
    copiedElement,
    selectedElement,
    selectedElementAnimations,
    updateElementsById,
  ]);

  /**
   * Revert some element styles to their defaults.
   *
   * Each element type has a different set of defaults.
   */
  const handleClearElementStyles = useCallback(() => {
    if (!selectedElement?.id) {
      return;
    }

    const resetProperties = getDefaultPropertiesForType(selectedElement.type);

    if (resetProperties) {
      updateElementsById({
        elementIds: [selectedElement.id],
        properties: (currentProperties) =>
          updateProperties(
            currentProperties,
            resetProperties,
            /* commitValues */ true
          ),
      });
    }
  }, [selectedElement, updateElementsById]);

  /**
   * Set currently selected element as the page's background.
   */
  const handleSetPageBackground = useCallback(() => {
    setBackgroundElement({ elementId: selectedElement.id });
  }, [setBackgroundElement, selectedElement?.id]);

  /**
   * Remove media from background and clear opacity and overlay.
   */
  const handleRemoveMediaFromBackground = useCallback(() => {
    updateElementsById({
      elementIds: [selectedElement.id],
      properties: (currentProperties) =>
        updateProperties(
          currentProperties,
          {
            isBackground: false,
            opacity: 100,
            overlay: null,
          },
          /* commitValues */ true
        ),
    });
    clearBackgroundElement();
  }, [clearBackgroundElement, selectedElement?.id, updateElementsById]);

  /**
   * Focus the media or the media3p panel.
   */
  const handleFocusMediaPanel = useCallback(() => {
    const idOrigin = selectedElement?.resource?.id?.toString().split(':')?.[0];
    const is3PGif =
      (!idOrigin || idOrigin?.toLowerCase() === 'media/tenor') &&
      selectedElement?.resource?.type?.toLowerCase() === 'gif';
    const is3PVideo = idOrigin?.toLowerCase() === 'media/coverr';
    const is3PImage = idOrigin?.toLowerCase() === 'media/unsplash';

    const panelToFocus =
      is3PImage || is3PVideo || is3PGif ? states.MEDIA3P : states.MEDIA;

    setHighlights({ highlight: panelToFocus });
  }, [selectedElement, setHighlights]);

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
          display: RIGHT_CLICK_MENU_SHORTCUTS.COPY,
        },
        onClick: handleCopyPage,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE,
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.PASTE },
        onClick: handlePastePage,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE,
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.DELETE },
        onClick: handleDeletePage,
        ...menuItemProps,
      },
    ],
    [handleCopyPage, menuItemProps, handleDeletePage, handlePastePage]
  );

  const layerItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD,
        separator: 'top',
        // TODO #8440: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.SEND_BACKWARD },
        disabled: !canElementMoveBackwards,
        onClick: handleSendBackward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
        // TODO #8440: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.SEND_TO_BACK },
        disabled: !canElementMoveBackwards,
        onClick: handleSendToBack,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
        // TODO #8440: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.BRING_FORWARD },
        disabled: !canElementMoveForwards,
        onClick: handleBringForward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
        // TODO #8440: this shortcut does not exist yet. Add shortcut to editor.
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.BRING_TO_FRONT },
        disabled: !canElementMoveForwards,
        onClick: handleBringToFront,
        ...menuItemProps,
      },
    ],
    [
      canElementMoveBackwards,
      handleSendBackward,
      menuItemProps,
      handleSendToBack,
      handleBringForward,
      canElementMoveForwards,
      handleBringToFront,
    ]
  );

  const backgroundMediaItems = useMemo(
    () => [
      ...defaultItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.DETACH_IMAGE_FROM_BACKGROUND,
        separator: 'top',
        onClick: handleRemoveMediaFromBackground,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.REPLACE_BACKGROUND_IMAGE,
        onClick: handleFocusMediaPanel,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND,
        onClick: handleOpenScaleAndCrop,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.CLEAR_STYLE,
        onClick: handleClearElementStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER,
        separator: 'top',
        onClick: () => handleAddPageAtPosition(currentPageIndex + 1),
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE,
        onClick: () => handleAddPageAtPosition(currentPageIndex),
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE,
        onClick: handleDuplicatePage,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.DELETE_PAGE,
        onClick: handleDeletePage,
        disabled: pages.length === 1,
        ...menuItemProps,
      },
    ],
    [
      currentPageIndex,
      defaultItems,
      handleAddPageAtPosition,
      handleClearElementStyles,
      handleDeletePage,
      handleDuplicatePage,
      handleOpenScaleAndCrop,
      handleRemoveMediaFromBackground,
      handleFocusMediaPanel,
      menuItemProps,
      pages,
    ]
  );

  const foregroundMediaItems = useMemo(
    () => [
      ...defaultItems,
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND,
        separator: 'top',
        onClick: handleSetPageBackground,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_IMAGE,
        onClick: handleOpenScaleAndCrop,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY_IMAGE_STYLES,
        separator: 'top',
        shortcut: {
          display: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        },
        onClick: handleCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_IMAGE_STYLES,
        shortcut: {
          display: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
        },
        onClick: handlePasteStyles,
        disabled: copiedElement.type !== selectedElement?.type,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.CLEAR_IMAGE_STYLES,
        onClick: handleClearElementStyles,
        ...menuItemProps,
      },
    ],
    [
      copiedElement,
      defaultItems,
      handleClearElementStyles,
      handleCopyStyles,
      handleOpenScaleAndCrop,
      handlePasteStyles,
      handleSetPageBackground,
      layerItems,
      menuItemProps,
      selectedElement,
    ]
  );

  const shapeItems = useMemo(
    () => [
      ...defaultItems,
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY_SHAPE_STYLES,
        separator: 'top',
        shortcut: {
          display: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        },
        onClick: handleCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_SHAPE_STYLES,
        shortcut: {
          display: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
        },
        onClick: handlePasteStyles,
        disabled: copiedElement.type !== selectedElement?.type,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.CLEAR_SHAPE_STYLES,
        onClick: handleClearElementStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS,
        onClick: handleAddColorPreset,
        ...menuItemProps,
      },
    ],
    [
      copiedElement?.type,
      defaultItems,
      handleAddColorPreset,
      handleClearElementStyles,
      handleCopyStyles,
      handlePasteStyles,
      layerItems,
      menuItemProps,
      selectedElement?.type,
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
    if (selectedElement?.isDefaultBackground) {
      return pageItems;
    }

    switch (selectedElement?.type) {
      case ELEMENT_TYPES.IMAGE:
      case ELEMENT_TYPES.VIDEO:
      case ELEMENT_TYPES.GIF:
        return selectedElement?.isBackground
          ? backgroundMediaItems
          : foregroundMediaItems;
      case ELEMENT_TYPES.SHAPE:
        return shapeItems;
      case ELEMENT_TYPES.TEXT:
      default:
        return pageItems;
    }
  }, [
    backgroundMediaItems,
    foregroundMediaItems,
    pageItems,
    selectedElement,
    shapeItems,
  ]);

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
