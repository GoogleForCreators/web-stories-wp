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
import {
  useGlobalKeyDownEffect,
  useSnackbar,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from '@web-stories-wp/react';
import { v4 as uuidv4 } from 'uuid';

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import { useStory } from '..';
import { createPage, duplicatePage } from '../../elements';
import updateProperties from '../../components/inspector/design/updateProperties';
import useAddPreset from '../../components/panels/design/preset/useAddPreset';
import useApplyStyle from '../../components/panels/design/preset/stylePreset/useApplyStyle';
import { PRESET_TYPES } from '../../components/panels/design/preset/constants';
import { useCanvas } from '../canvas';
import { ELEMENT_TYPES } from '../story';
import { getTextPresets } from '../../components/panels/design/preset/utils';
import getUpdatedSizeAndPosition from '../../utils/getUpdatedSizeAndPosition';
import { useHistory } from '../history';
import useDeletePreset from '../../components/panels/design/preset/useDeletePreset';
import { noop } from '../../utils/noop';
import {
  RIGHT_CLICK_MENU_LABELS,
  RIGHT_CLICK_MENU_SHORTCUTS,
} from './constants';
import Context from './context';
import rightClickMenuReducer, {
  ACTION_TYPES,
  DEFAULT_RIGHT_CLICK_MENU_STATE,
} from './reducer';
import { getDefaultPropertiesForType, getElementStyles } from './utils';

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
  const { addGlobalPreset: addGlobalTextPreset } = useAddPreset({
    presetType: PRESET_TYPES.STYLE,
  });
  const { addGlobalPreset: addGlobalColorPreset } = useAddPreset({
    presetType: PRESET_TYPES.COLOR,
  });
  const { deleteGlobalPreset: deleteGlobalTextPreset } = useDeletePreset({
    presetType: PRESET_TYPES.STYLE,
    setIsEditMode: noop,
  });
  const { deleteGlobalPreset: deleteGlobalColorPreset } = useDeletePreset({
    presetType: PRESET_TYPES.COLOR,
    setIsEditMode: noop,
  });
  const { setEditingElement } = useCanvas(({ actions }) => ({
    setEditingElement: actions.setEditingElement,
  }));
  const { undo } = useHistory(({ actions: { undo } }) => ({
    undo,
  }));
  const { showSnackbar } = useSnackbar();
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
      selectedElementAnimations,
      selectedElements,
      setBackgroundElement,
      updateElementsById,
    })
  );

  // Ref for attaching the context menu
  const rightClickAreaRef = useRef();

  // Needed to not pass stale refs of `undo` to snackbar
  const undoRef = useRef(undo);
  undoRef.current = undo;

  const [{ copiedElement, isMenuOpen, menuPosition }, dispatch] = useReducer(
    rightClickMenuReducer,
    DEFAULT_RIGHT_CLICK_MENU_STATE
  );

  const selectedElement = selectedElements?.[0];
  const selectedElementType = selectedElement?.type;
  const currentPosition = currentPage?.elements.findIndex(
    (element) => element.id === selectedElement?.id
  );
  const canElementMoveBackwards = currentPosition > 1;
  const canElementMoveForwards =
    currentPosition < currentPage?.elements.length - 1;

  /**
   * Open the menu at the position from the click event.
   *
   * @param {Event} evt The triggering event
   */
  const handleOpenMenu = useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    dispatch({
      type: ACTION_TYPES.OPEN_MENU,
      payload: {
        x: evt?.x,
        y: evt?.y,
      },
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

      trackEvent('context_menu_action', {
        name: 'page_added',
        element: selectedElementType,
        isBackground: selectedElement?.isBackground,
      });
    },
    [
      addPageAt,
      pages?.length,
      selectedElement?.isBackground,
      selectedElementType,
    ]
  );

  /**
   * Delete the current page.
   */
  const handleDeletePage = useCallback(() => {
    deleteCurrentPage();

    trackEvent('context_menu_action', {
      name: 'page_deleted',
      element: selectedElementType,
      isBackground: selectedElement?.isBackground,
    });
  }, [deleteCurrentPage, selectedElement?.isBackground, selectedElementType]);

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

    trackEvent('context_menu_action', {
      name: 'send_backward',
      element: selectedElementType,
      isBackground: selectedElement?.isBackground,
    });
  }, [
    arrangeElement,
    currentPosition,
    selectedElement?.id,
    selectedElement?.isBackground,
    selectedElementType,
  ]);

  /**
   * Send element all the way back, if possible.
   */
  const handleSendToBack = useCallback(() => {
    arrangeElement({
      elementId: selectedElement.id,
      position: 1,
    });

    trackEvent('context_menu_action', {
      name: 'send_to_back',
      element: selectedElementType,
    });
  }, [arrangeElement, selectedElement?.id, selectedElementType]);

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

    trackEvent('context_menu_action', {
      name: 'bring_forward',
      element: selectedElementType,
    });
  }, [
    arrangeElement,
    currentPage,
    currentPosition,
    selectedElement?.id,
    selectedElementType,
  ]);

  /**
   * Send element all the way to the front, if possible.
   */
  const handleBringToFront = useCallback(() => {
    arrangeElement({
      elementId: selectedElement.id,
      position: currentPage.elements.length - 1,
    });

    trackEvent('context_menu_action', {
      name: 'bring_to_front',
      element: selectedElementType,
    });
  }, [arrangeElement, currentPage, selectedElement?.id, selectedElementType]);

  /**
   * Set element as the element being 'edited'.
   *
   * @param {Event} evt The triggering event
   */
  const handleOpenScaleAndCrop = useCallback(
    (evt) => {
      setEditingElement(selectedElement?.id, evt);

      trackEvent('context_menu_action', {
        name: 'open_scale_and_crop',
        element: selectedElementType,
        isBackground: selectedElement?.isBackground,
      });
    },
    [
      selectedElement?.id,
      selectedElement?.isBackground,
      selectedElementType,
      setEditingElement,
    ]
  );

  /**
   * Copy the styles and animations of the selected element.
   */
  const handleCopyStyles = useCallback(() => {
    const oldStyles = { ...copiedElement };

    dispatch({
      type: ACTION_TYPES.COPY_ELEMENT_STYLES,
      payload: {
        animations: selectedElementAnimations,
        styles: getElementStyles(selectedElement),
        type: selectedElementType,
      },
    });

    showSnackbar({
      actionLabel: __('Undo', 'web-stories'),
      dismissable: false,
      message: __('Copied style.', 'web-stories'),
      onAction: () => {
        dispatch({
          type: ACTION_TYPES.COPY_ELEMENT_STYLES,
          payload: oldStyles,
        });

        trackEvent('context_menu_action', {
          name: 'undo_copy_styles',
          element: selectedElementType,
          isBackground: selectedElement?.isBackground,
        });
      },
    });

    trackEvent('context_menu_action', {
      name: 'copy_styles',
      element: selectedElementType,
      isBackground: selectedElement?.isBackground,
    });
  }, [
    copiedElement,
    selectedElement,
    selectedElementAnimations,
    selectedElementType,
    showSnackbar,
  ]);

  const selectedElementId = selectedElement?.id;
  const pushUpdate = useCallback(
    (update, commitValues) => {
      if (selectedElementId) {
        updateElementsById({
          elementIds: [selectedElementId],
          properties: (element) => {
            const updates = updateProperties(element, update, commitValues);
            const sizeUpdates = getUpdatedSizeAndPosition({
              ...element,
              ...updates,
            });
            return {
              ...updates,
              ...sizeUpdates,
            };
          },
        });
      }
    },
    [selectedElementId, updateElementsById]
  );

  const handleApplyStyle = useApplyStyle({ pushUpdate });

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

    addAnimations({ animations: newAnimations });

    // Text elements need the text styles extracted from content before
    // applying to the other text
    if (copiedElement.type === 'text' && copiedElement.styles.content) {
      const { textStyles } = getTextPresets(
        [copiedElement.styles],
        {
          textStyles: [],
          colors: [],
        },
        PRESET_TYPES.STYLE
      );
      const { colors } = getTextPresets(
        [copiedElement.styles],
        {
          textStyles: [],
          colors: [],
        },
        PRESET_TYPES.Color
      );
      const { content, ...copiedElementStyles } = copiedElement.styles;
      const updatedElementStyles = {
        ...copiedElementStyles,
        ...textStyles[0],
        ...colors[0].color,
        animation: oldAnimationToDelete,
        border: copiedElementStyles.border || null,
      };
      handleApplyStyle(updatedElementStyles);
    } else {
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
    }

    showSnackbar({
      actionLabel: __('Undo', 'web-stories'),
      dismissable: false,
      message: __('Pasted style.', 'web-stories'),
      // don't pass a stale reference for undo
      // need history updates to run so `undo` works correctly.
      onAction: () => {
        undoRef.current();

        trackEvent('context_menu_action', {
          name: 'undo_paste_styles',
          element: selectedElementType,
          isBackground: selectedElement?.isBackground,
        });
      },
    });

    trackEvent('context_menu_action', {
      name: 'paste_styles',
      element: selectedElementType,
      isBackground: selectedElement?.isBackground,
    });
  }, [
    addAnimations,
    copiedElement,
    handleApplyStyle,
    selectedElement,
    selectedElementAnimations,
    selectedElementType,
    showSnackbar,
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

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message: __('Cleared style.', 'web-stories'),
        // don't pass a stale reference for undo
        // need history updates to run so `undo` works correctly.
        onAction: () => {
          undoRef.current();

          trackEvent('context_menu_action', {
            name: 'undo_clear_styles',
            element: selectedElementType,
            isBackground: selectedElement?.isBackground,
          });
        },
      });

      trackEvent('context_menu_action', {
        name: 'clear_styles',
        element: selectedElementType,
        isBackground: selectedElement?.isBackground,
      });
    }
  }, [selectedElement, selectedElementType, showSnackbar, updateElementsById]);

  /**
   * Set currently selected element as the page's background.
   */
  const handleSetPageBackground = useCallback(() => {
    setBackgroundElement({ elementId: selectedElement.id });

    trackEvent('context_menu_action', {
      name: 'set_as_page_background',
      element: selectedElementType,
    });
  }, [setBackgroundElement, selectedElement?.id, selectedElementType]);

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

    trackEvent('context_menu_action', {
      name: 'remove_media_from_background',
      element: selectedElementType,
      isBackground: selectedElement?.isBackground,
    });
  }, [
    clearBackgroundElement,
    selectedElement?.id,
    selectedElement?.isBackground,
    selectedElementType,
    updateElementsById,
  ]);

  /**
   * Add text styles to global presets.
   *
   * @param {Event} evt The triggering event
   */
  const handleAddTextPreset = useCallback(
    (evt) => {
      const preset = addGlobalTextPreset(evt);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message: __('Saved style to "Saved Styles".', 'web-stories'),
        onAction: () => {
          deleteGlobalTextPreset(preset);

          trackEvent('context_menu_action', {
            name: 'remove_text_preset',
            element: selectedElementType,
          });
        },
      });

      trackEvent('context_menu_action', {
        name: 'add_text_preset',
        element: selectedElementType,
      });
    },
    [
      addGlobalTextPreset,
      deleteGlobalTextPreset,
      selectedElementType,
      showSnackbar,
    ]
  );

  /**
   * Add color to global presets.
   *
   * @param {Event} evt The triggering event
   */
  const handleAddColorPreset = useCallback(
    (evt) => {
      const preset = addGlobalColorPreset(evt);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message: __('Added color to "Saved Colors".', 'web-stories'),
        onAction: () => {
          deleteGlobalColorPreset(preset);

          trackEvent('context_menu_action', {
            name: 'remove_color_preset',
            element: selectedElementType,
          });
        },
      });

      trackEvent('context_menu_action', {
        name: 'add_color_preset',
        element: selectedElementType,
      });
    },
    [
      addGlobalColorPreset,
      deleteGlobalColorPreset,
      selectedElementType,
      showSnackbar,
    ]
  );

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
        onClick: handleSendBackward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.SEND_TO_BACK,
        disabled: !canElementMoveBackwards,
        onClick: handleSendToBack,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.BRING_FORWARD,
        disabled: !canElementMoveForwards,
        onClick: handleBringForward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.BRING_TO_FRONT,
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

  const pageManipulationItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER,
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
      handleAddPageAtPosition,
      handleDeletePage,
      handleDuplicatePage,
      menuItemProps,
      pages,
    ]
  );

  const pageItems = useMemo(() => {
    const disableBackgroundMediaActions = selectedElement?.isDefaultBackground;

    return [
      {
        label: RIGHT_CLICK_MENU_LABELS.DETACH_IMAGE_FROM_BACKGROUND,
        onClick: handleRemoveMediaFromBackground,
        disabled: disableBackgroundMediaActions,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND,
        onClick: handleOpenScaleAndCrop,
        disabled: disableBackgroundMediaActions,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.CLEAR_STYLE,
        onClick: handleClearElementStyles,
        disabled: disableBackgroundMediaActions,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...pageManipulationItems,
    ];
  }, [
    handleClearElementStyles,
    handleOpenScaleAndCrop,
    handleRemoveMediaFromBackground,
    menuItemProps,
    pageManipulationItems,
    selectedElement?.isDefaultBackground,
  ]);

  const textItems = useMemo(
    () => [
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY_STYLES,
        separator: 'top',
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        onClick: handleCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_STYLES,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
        onClick: handlePasteStyles,
        disabled: copiedElement.type !== selectedElement?.type,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_TO_TEXT_PRESETS,
        onClick: handleAddTextPreset,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS,
        onClick: handleAddColorPreset,
        ...menuItemProps,
      },
    ],
    [
      layerItems,
      handleAddTextPreset,
      menuItemProps,
      handleAddColorPreset,
      handleCopyStyles,
      handlePasteStyles,
      copiedElement,
      selectedElement,
    ]
  );

  const foregroundMediaItems = useMemo(
    () => [
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
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        onClick: handleCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_IMAGE_STYLES,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
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
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY_SHAPE_STYLES,
        separator: 'top',
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES,
        onClick: handleCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_SHAPE_STYLES,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
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
      handleAddColorPreset,
      handleClearElementStyles,
      handleCopyStyles,
      handlePasteStyles,
      layerItems,
      menuItemProps,
      selectedElement?.type,
    ]
  );

  const stickerItems = useMemo(() => [...layerItems], [layerItems]);

  const menuItems = useMemo(() => {
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
    pageItems,
    selectedElement,
    shapeItems,
    stickerItems,
    textItems,
  ]);

  // Override the browser's context menu if the
  // rightClickAreaRef is set
  useEffect(() => {
    const node = rightClickAreaRef.current;
    if (!node) {
      return undefined;
    }

    node.addEventListener('contextmenu', handleOpenMenu);

    return () => {
      node.removeEventListener('contextmenu', handleOpenMenu);
    };
  }, [handleOpenMenu]);

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
      menuItems,
      menuPosition,
      onCloseMenu: handleCloseMenu,
      onOpenMenu: handleOpenMenu,
      rightClickAreaRef,
    }),
    [handleCloseMenu, handleOpenMenu, isMenuOpen, menuItems, menuPosition]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

RightClickMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RightClickMenuProvider;
