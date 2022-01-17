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
  prettifyShortcut,
  useGlobalKeyDownEffect,
  useSnackbar,
} from '@web-stories-wp/design-system';
import { __, sprintf } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from '@web-stories-wp/react';
import { v4 as uuidv4 } from 'uuid';

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import useStory from '../story/useStory';
import { useLocalMedia } from '../media';
import { createPage, duplicatePage, ELEMENT_TYPES } from '../../elements';
import updateProperties from '../../components/inspector/design/updateProperties';
import useAddPreset from '../../utils/useAddPreset';
import useApplyStyle from '../../components/panels/design/textStyle/stylePresets/useApplyStyle';
import { PRESET_TYPES } from '../../constants';
import { useCanvas } from '../canvas';
import { getTextPresets } from '../../utils/presetUtils';
import getUpdatedSizeAndPosition from '../../utils/getUpdatedSizeAndPosition';
import { useHistory } from '../history';
import useDeleteStyle from '../../components/panels/design/textStyle/stylePresets/useDeleteStyle';
import useDeleteColor from '../../components/colorPicker/useDeleteColor';
import { noop } from '../../utils/noop';
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
import { getDefaultPropertiesForType, getElementStyles } from './utils';

const UNDO_HELP_TEXT = sprintf(
  /* translators: %s: Ctrl/Cmd + Z keyboard shortcut */
  __('Press %s to undo the last change', 'web-stories'),
  prettifyShortcut('mod+z')
);

const CLEARABLE_ELEMENT_TYPES = ['image', 'video', 'gif', 'shape'];

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
  const deleteGlobalTextPreset = useDeleteStyle({
    onEmpty: noop,
  });
  const { deleteGlobalPreset: deleteGlobalColorPreset } = useDeleteColor({
    onEmpty: noop,
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
    duplicateElementById,
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
        duplicateElementById,
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
      duplicateElementById,
      pages,
      selectedElementAnimations,
      selectedElements,
      setBackgroundElement,
      updateElementsById,
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

  /**
   * Duplicate all selected elements.
   */
  const handleDuplicateElements = useCallback(() => {
    if (!selectedElements.length) {
      return;
    }

    selectedElements.map(({ id }) => duplicateElementById({ elementId: id }));
  }, [duplicateElementById, selectedElements]);

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
      dismissible: false,
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
      actionHelpText: UNDO_HELP_TEXT,
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
      dismissible: false,
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
      actionHelpText: UNDO_HELP_TEXT,
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
   * Reset styles for one element to their defaults. Return the styles that were reset
   * or null if there are not styles to reset.
   *
   * @param {Object} element The element to reset.
   * @return {Object|null} The new styles or null.
   */
  const clearElementStyles = useCallback(
    (element) => {
      const resetProperties = getDefaultPropertiesForType(element.type);

      if (resetProperties) {
        updateElementsById({
          elementIds: [element.id],
          properties: (currentProperties) =>
            updateProperties(
              currentProperties,
              resetProperties,
              /* commitValues */ true
            ),
        });
      }

      return resetProperties;
    },
    [updateElementsById]
  );

  /**
   * Revert element styles to their defaults. Show a snackbar with a button
   * that can 'undo' the change.
   *
   * Each element type has a different set of defaults.
   */
  const handleClearElementStyles = useCallback(() => {
    if (!selectedElements.length) {
      return;
    }

    const stylesReset = selectedElements
      .map(
        (element) =>
          // only clear element styles for certain element types
          CLEARABLE_ELEMENT_TYPES.includes(element.type) &&
          clearElementStyles(element)
      )
      .some((styles) => Boolean(styles));

    // only show snackbar if any elements had styles reset
    if (stylesReset) {
      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Cleared style.', 'web-stories'),
        // don't pass a stale reference for undo
        // need history updates to run so `undo` works correctly.
        onAction: () => {
          undoRef.current();

          trackEvent('context_menu_action', {
            name: 'undo_clear_styles',
            elements: selectedElements.map((element) => element.type),
            hasBackgroundElement: selectedElements.some(
              (element) => element.isBackground
            ),
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });

      trackEvent('context_menu_action', {
        name: 'clear_styles',
        elements: selectedElements.map((element) => element.type),
        hasBackgroundElement: selectedElements.some(
          (element) => element.isBackground
        ),
      });
    }
  }, [clearElementStyles, selectedElements, showSnackbar]);

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
        dismissible: false,
        message: __('Saved style to "Saved Styles".', 'web-stories'),
        onAction: () => {
          deleteGlobalTextPreset(preset);

          trackEvent('context_menu_action', {
            name: 'remove_text_preset',
            element: selectedElementType,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
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
        dismissible: false,
        message: __('Added color to "Saved Colors".', 'web-stories'),
        onAction: () => {
          deleteGlobalColorPreset(preset);

          trackEvent('context_menu_action', {
            name: 'remove_color_preset',
            element: selectedElementType,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
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
    const isVideo = selectedElement?.type === 'video';
    const detachLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.DETACH_VIDEO_FROM_BACKGROUND
      : RIGHT_CLICK_MENU_LABELS.DETACH_IMAGE_FROM_BACKGROUND;
    const scaleLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_VIDEO
      : RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_IMAGE;

    return [
      {
        label: detachLabel,
        onClick: handleRemoveMediaFromBackground,
        disabled: disableBackgroundMediaActions,
        ...menuItemProps,
      },
      {
        label: scaleLabel,
        onClick: handleOpenScaleAndCrop,
        disabled: disableBackgroundMediaActions,
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
        label: RIGHT_CLICK_MENU_LABELS.CLEAR_STYLES(selectedElements.length),
        onClick: handleClearElementStyles,
        disabled: disableBackgroundMediaActions,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...pageManipulationItems,
    ];
  }, [
    canTranscodeResource,
    handleClearElementStyles,
    handleOpenScaleAndCrop,
    handleRemoveMediaFromBackground,
    hasTrimMode,
    menuItemProps,
    pageManipulationItems,
    selectedElement,
    selectedElements.length,
    toggleTrimMode,
  ]);

  const textItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: handleDuplicateElements,
        separator: 'bottom',
        ...menuItemProps,
      },
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
      handleDuplicateElements,
      menuItemProps,
      handleAddColorPreset,
      handleCopyStyles,
      handlePasteStyles,
      copiedElement,
      selectedElement,
      selectedElements.length,
    ]
  );

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
    const clearLabel = isVideo
      ? RIGHT_CLICK_MENU_LABELS.CLEAR_VIDEO_STYLES
      : RIGHT_CLICK_MENU_LABELS.CLEAR_IMAGE_STYLES;

    return [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: handleDuplicateElements,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND,
        separator: 'top',
        onClick: handleSetPageBackground,
        ...menuItemProps,
      },
      {
        label: scaleLabel,
        onClick: handleOpenScaleAndCrop,
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
        onClick: handleCopyStyles,
        ...menuItemProps,
      },
      {
        label: pasteLabel,
        shortcut: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES,
        onClick: handlePasteStyles,
        disabled: copiedElement.type !== selectedElement?.type,
        ...menuItemProps,
      },
      {
        label: clearLabel,
        onClick: handleClearElementStyles,
        ...menuItemProps,
      },
    ];
  }, [
    canTranscodeResource,
    copiedElement,
    handleClearElementStyles,
    handleCopyStyles,
    handleDuplicateElements,
    handleOpenScaleAndCrop,
    handlePasteStyles,
    handleSetPageBackground,
    hasTrimMode,
    layerItems,
    menuItemProps,
    selectedElement,
    selectedElements.length,
    toggleTrimMode,
  ]);

  const shapeItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: handleDuplicateElements,
        separator: 'bottom',
        ...menuItemProps,
      },
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
      handleDuplicateElements,
      handlePasteStyles,
      layerItems,
      menuItemProps,
      selectedElement?.type,
      selectedElements.length,
    ]
  );

  const stickerItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: handleDuplicateElements,
        separator: 'bottom',
        ...menuItemProps,
      },
      ...layerItems,
    ],
    [
      handleDuplicateElements,
      layerItems,
      menuItemProps,
      selectedElements.length,
    ]
  );

  const multipleElementItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(
          selectedElements.length
        ),
        onClick: handleDuplicateElements,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.CLEAR_STYLES(selectedElements.length),
        onClick: handleClearElementStyles,
        ...menuItemProps,
      },
    ],
    [
      handleClearElementStyles,
      handleDuplicateElements,
      menuItemProps,
      selectedElements.length,
    ]
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
    }),
    [handleCloseMenu, handleOpenMenu, isMenuOpen, menuItems, menuPosition]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

RightClickMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RightClickMenuProvider;
