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
  useSnackbar,
  useGlobalKeyDownEffect,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';
import { useFeature } from 'flagged';
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
import { states, useHighlights } from '../highlights';
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
  const enableRightClickMenus = useFeature('enableRightClickMenus');

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
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
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

  // Needed to not pass stale refs of `undo` to snackbar
  const undoRef = useRef(undo);
  undoRef.current = undo;

  const [{ copiedElement, copiedPage, isMenuOpen, menuPosition }, dispatch] =
    useReducer(rightClickMenuReducer, DEFAULT_RIGHT_CLICK_MENU_STATE);

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
   * @param {Object} evt The triggering event
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

    trackClick(evt, 'context_menu_opened');
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
   * @param {Object} evt The triggering event
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
   * @param {Object} evt The triggering event
   * @param {number} index The index
   */
  const handleAddPageAtPosition = useCallback(
    (evt, index) => {
      const position = Boolean(index) || index === 0 ? index : pages.length - 1;

      addPageAt({ page: createPage(), position });

      trackClick(evt, 'context_menu_page_added');
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
   *
   * @param {Object} evt The triggering event
   */
  const handleSendBackward = useCallback(
    (evt) => {
      const newPosition =
        currentPosition === 1 ? currentPosition : currentPosition - 1;

      arrangeElement({
        elementId: selectedElement.id,
        position: newPosition,
      });

      trackClick(evt, `context_menu_${selectedElementType}_send_backward`);
    },
    [arrangeElement, currentPosition, selectedElement?.id, selectedElementType]
  );

  /**
   * Send element all the way back, if possible.
   *
   * @param {Object} evt The triggering event
   */
  const handleSendToBack = useCallback(
    (evt) => {
      arrangeElement({
        elementId: selectedElement.id,
        position: 1,
      });

      trackClick(evt, `context_menu_${selectedElementType}_sent_to_back`);
    },
    [arrangeElement, selectedElement?.id, selectedElementType]
  );

  /**
   * Bring element one layer forwards, if possible.
   *
   * @param {Object} evt The triggering event
   */
  const handleBringForward = useCallback(
    (evt) => {
      const newPosition =
        currentPosition >= currentPage.elements.length - 1
          ? currentPosition
          : currentPosition + 1;

      arrangeElement({
        elementId: selectedElement.id,
        position: newPosition,
      });

      trackClick(evt, `context_menu_${selectedElementType}_bring_forward`);
    },
    [
      arrangeElement,
      currentPage,
      currentPosition,
      selectedElement?.id,
      selectedElementType,
    ]
  );

  /**
   * Send element all the way to the front, if possible.
   *
   * @param {Object} evt The triggering event
   */
  const handleBringToFront = useCallback(
    (evt) => {
      arrangeElement({
        elementId: selectedElement.id,
        position: currentPage.elements.length - 1,
      });

      trackClick(evt, `context_menu_${selectedElementType}_bring_to_front`);
    },
    [arrangeElement, currentPage, selectedElement?.id, selectedElementType]
  );

  /**
   * Set element as the element being 'edited'.
   *
   * @param {Object} evt The triggering event
   */
  const handleOpenScaleAndCrop = useCallback(
    (evt) => {
      setEditingElement(selectedElement?.id, evt);

      trackClick(
        evt,
        `context_menu_${selectedElementType}_open_scale_and_crop`
      );
    },
    [selectedElement?.id, selectedElementType, setEditingElement]
  );

  /**
   * Copy the styles and animations of the selected element.
   *
   * @param {Object} evt The triggering event
   */
  const handleCopyStyles = useCallback(
    (evt) => {
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
        onAction: (undoEvt) => {
          dispatch({
            type: ACTION_TYPES.COPY_ELEMENT_STYLES,
            payload: oldStyles,
          });

          trackClick(
            undoEvt,
            `context_menu_undo_${selectedElementType}_copy_styles`
          );
        },
      });

      trackClick(evt, `context_menu_${selectedElementType}_copy_styles`);
    },
    [
      copiedElement,
      selectedElement,
      selectedElementAnimations,
      selectedElementType,
      showSnackbar,
    ]
  );

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
   *
   * @param {Object} evt The triggering event
   */
  const handlePasteStyles = useCallback(
    (evt) => {
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
        onAction: (undoEvt) => {
          undoRef.current();

          trackClick(
            undoEvt,
            `context_menu_undo_${selectedElementType}_paste_styles`
          );
        },
      });

      trackClick(evt, `context_menu_${selectedElementType}_paste_styles`);
    },
    [
      addAnimations,
      copiedElement,
      handleApplyStyle,
      selectedElement,
      selectedElementAnimations,
      selectedElementType,
      showSnackbar,
      updateElementsById,
    ]
  );

  /**
   * Revert some element styles to their defaults.
   *
   * Each element type has a different set of defaults.
   *
   * @param {Object} evt The triggering event
   */
  const handleClearElementStyles = useCallback(
    (evt) => {
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
          onAction: (undoEvt) => {
            undoRef.current();

            trackClick(
              undoEvt,
              `context_menu_undo_${selectedElementType}_clear_styles`
            );
          },
        });

        trackClick(evt, `context_menu_${selectedElementType}_clear_styles`);
      }
    },
    [selectedElement, selectedElementType, showSnackbar, updateElementsById]
  );

  /**
   * Set currently selected element as the page's background.
   *
   * @param {Object} evt The triggering event
   */
  const handleSetPageBackground = useCallback(
    (evt) => {
      setBackgroundElement({ elementId: selectedElement.id });

      trackClick(
        evt,
        `context_menu_${selectedElementType}_set_page_background`
      );
    },
    [setBackgroundElement, selectedElement?.id, selectedElementType]
  );

  /**
   * Remove media from background and clear opacity and overlay.
   *
   * @param {Object} evt The triggering event
   */
  const handleRemoveMediaFromBackground = useCallback(
    (evt) => {
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

      trackClick(evt, `context_menu_${selectedElementType}_remove_background`);
    },
    [
      clearBackgroundElement,
      selectedElement?.id,
      selectedElementType,
      updateElementsById,
    ]
  );

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

  /**
   * Add text styles to global presets.
   *
   * @param {Object} evt The triggering event
   */
  const handleAddTextPreset = useCallback(
    (evt) => {
      const preset = addGlobalTextPreset(evt);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message: __('Saved style to "Saved Styles".', 'web-stories'),
        onAction: (undoEvt) => {
          deleteGlobalTextPreset(preset);

          trackClick(undoEvt, 'context_menu_remove_text_preset');
        },
      });

      trackClick(evt, 'context_menu_add_text_preset');
    },
    [addGlobalTextPreset, deleteGlobalTextPreset, showSnackbar]
  );

  /**
   * Add color to global presets.
   *
   * @param {Object} evt The triggering event
   */
  const handleAddColorPreset = useCallback(
    (evt) => {
      const preset = addGlobalColorPreset(evt);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissable: false,
        message: __('Added color to "Saved Colors".', 'web-stories'),
        onAction: (undoEvt) => {
          deleteGlobalColorPreset(preset);

          trackClick(undoEvt, 'context_menu_remove_color_preset');
        },
      });

      trackClick(evt, 'context_menu_add_color_preset');
    },
    [addGlobalColorPreset, deleteGlobalColorPreset, showSnackbar]
  );

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
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.SEND_BACKWARD },
        disabled: !canElementMoveBackwards,
        onClick: handleSendBackward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK,
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.SEND_TO_BACK },
        disabled: !canElementMoveBackwards,
        onClick: handleSendToBack,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_FORWARD,
        shortcut: { display: RIGHT_CLICK_MENU_SHORTCUTS.BRING_FORWARD },
        disabled: !canElementMoveForwards,
        onClick: handleBringForward,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT,
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

  const pageManipulationItems = useMemo(
    () => [
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER,
        separator: 'top',
        onClick: (evt) => handleAddPageAtPosition(evt, currentPageIndex + 1),
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE,
        onClick: (evt) => handleAddPageAtPosition(evt, currentPageIndex),
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
      ...pageManipulationItems,
    ],
    [
      defaultItems,
      handleClearElementStyles,
      handleOpenScaleAndCrop,
      handleRemoveMediaFromBackground,
      handleFocusMediaPanel,
      menuItemProps,
      pageManipulationItems,
    ]
  );

  const textItems = useMemo(
    () => [
      ...defaultItems,
      ...layerItems,
      {
        label: RIGHT_CLICK_MENU_LABELS.COPY_STYLES,
        separator: 'top',
        shortcut: {
          display: RIGHT_CLICK_MENU_SHORTCUTS.COPY_IMAGE_STYLES,
        },
        onClick: handleCopyStyles,
        ...menuItemProps,
      },
      {
        label: RIGHT_CLICK_MENU_LABELS.PASTE_STYLES,
        shortcut: {
          display: RIGHT_CLICK_MENU_SHORTCUTS.PASTE_IMAGE_STYLES,
        },
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
      defaultItems,
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
    () => [...defaultItems, ...pageManipulationItems],
    [defaultItems, pageManipulationItems]
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
        return textItems;
      default:
        return pageItems;
    }
  }, [
    backgroundMediaItems,
    foregroundMediaItems,
    pageItems,
    selectedElement,
    shapeItems,
    textItems,
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
