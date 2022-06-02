/*
 * Copyright 2022 Google LLC
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
import { useSnackbar } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { useCallback, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { MaskTypes } from "@googleforcreators/masks";
/**
 * Internal dependencies
 */
import { useCanvas, useHistory, useStory } from '../..';
import updateProperties from '../../../components/style/updateProperties';
import { UNDO_HELP_TEXT } from './constants';

/**
 * Creates the right click menu element actions.
 *
 * @return {Object} Right click menu element actions
 */
const useElementActions = () => {
  const {
    clearBackgroundElement,
    duplicateElementsById,
    selectedElements,
    setBackgroundElement,
    updateElementsById,
    deleteElementById,
  } = useStory(({ state, actions }) => ({
    clearBackgroundElement: actions.clearBackgroundElement,
    duplicateElementsById: actions.duplicateElementsById,
    selectedElements: state.selectedElements,
    setBackgroundElement: actions.setBackgroundElement,
    updateElementsById: actions.updateElementsById,
    deleteElementById: actions.deleteElementById,
  }));
  const showSnackbar = useSnackbar((value) => value.showSnackbar);
  const setEditingElement = useCanvas(
    ({ actions }) => actions.setEditingElement
  );
  const undo = useHistory(({ actions }) => actions.undo);

  // Needed to not pass stale refs of `undo` to snackbar
  const undoRef = useRef(undo);
  undoRef.current = undo;

  /**
   * Duplicate all selected elements.
   */
  const handleDuplicateSelectedElements = useCallback(() => {
    if (!selectedElements.length) {
      return;
    }

    duplicateElementsById({
      elementIds: selectedElements.map(({ id }) => id),
    });

    showSnackbar({
      actionLabel: __('Undo', 'web-stories'),
      dismissible: false,
      message: __('Duplicated elements.', 'web-stories'),
      // don't pass a stale reference for undo
      // need history updates to run so `undo` works correctly.
      onAction: () => {
        undoRef.current();

        trackEvent('context_menu_action', {
          name: 'undo_duplicate_elements',
          elements: selectedElements.map((element) => element.type),
        });
      },
      actionHelpText: UNDO_HELP_TEXT,
    });

    trackEvent('context_menu_action', {
      name: 'duplicate_elements',
      elements: selectedElements.map((element) => element.type),
    });
  }, [duplicateElementsById, selectedElements, showSnackbar]);

  /**
   * Set element as the element being 'edited'.
   *
   * @param {Event} evt The triggering event
   */
  const handleOpenScaleAndCrop = useCallback(
    (evt) => {
      const selectedElement = selectedElements?.[0];

      if (selectedElement) {
        setEditingElement(selectedElement.id, evt);

        trackEvent('context_menu_action', {
          name: 'open_scale_and_crop',
          element: selectedElement.type,
          isBackground: selectedElement.isBackground,
        });
      }
    },
    [selectedElements, setEditingElement]
  );

  /**
   * Set currently selected element as the page's background.
   */
  const handleSetPageBackground = useCallback(() => {
    const selectedElement = selectedElements?.[0];

    if (selectedElement && !selectedElement.isBackground) {
      setBackgroundElement({ elementId: selectedElement.id });

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Set page background.', 'web-stories'),
        // don't pass a stale reference for undo
        // need history updates to run so `undo` works correctly.
        onAction: () => {
          undoRef.current();

          trackEvent('context_menu_action', {
            name: 'undo_set_page_background',
            element: selectedElement.type,
            isBackground: selectedElement.isBackground,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });

      trackEvent('context_menu_action', {
        name: 'set_as_page_background',
        element: selectedElement.type,
        isBackground: selectedElement.isBackground,
      });
    }
  }, [selectedElements, setBackgroundElement, showSnackbar]);

  /**
   * Retrieve shape and image from selected elements.
   */
  const shapeMaskElements = useCallback(() => {
    if (selectedElements?.length > 2) {
      return [];
    }

    let image, shape;

    selectedElements.forEach((element) => {
      element.type === 'shape' && (shape = element);
      element.type === 'image' && (image = element);
    });

    if (shape && image) {
      return [shape, image];
    }

    return [];
  }, [selectedElements]);

  /**
   * Apply shape mask to element.
   *
   * @param {Object} shape Element to use for the mask.
   * @param {Object} image Element that the mask will be applied to.
   */
  const handleUseShapeAsMask = (shape, image) => {
    updateElementsById({
      elementIds: [image.id],
      properties: (currentProperties) =>
        updateProperties(currentProperties, {
          mask: { type: shape?.mask?.type },
        }),
    });

    deleteElementById({ elementId: shape.id });
  };

  const hasShapeMask = selectedElements?.[0] && selectedElements[0].mask.type !== MaskTypes.RECTANGLE;

  const handleRemoveElementMask = useCallback(() => {
    const selectedElement = selectedElements?.[0];

    if (!selectedElement) return;

    updateElementsById({
      elementIds: [selectedElement.id],
      properties: (currentProperties) =>
        updateProperties(currentProperties, {
          mask: { type: MaskTypes.RECTANGLE },
        }),
    });
  }, [selectedElements]);

  /**
   * Remove media from background and clear opacity and overlay.
   */
  const handleRemovePageBackground = useCallback(() => {
    const selectedElement = selectedElements?.[0];

    if (selectedElement && selectedElement.isBackground) {
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

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Removed page background.', 'web-stories'),
        // don't pass a stale reference for undo
        // need history updates to run so `undo` works correctly.
        onAction: () => {
          undoRef.current();

          trackEvent('context_menu_action', {
            name: 'undo_remove_page_background',
            elements: selectedElement.type,
            isBackground: selectedElement.isBackground,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });

      trackEvent('context_menu_action', {
        name: 'remove_media_from_background',
        element: selectedElement.type,
        isBackground: selectedElement.isBackground,
      });
    }
  }, [
    clearBackgroundElement,
    selectedElements,
    showSnackbar,
    updateElementsById,
  ]);

  return {
    hasShapeMask,
    handleRemoveElementMask,
    shapeMaskElements,
    handleUseShapeAsMask,
    handleDuplicateSelectedElements,
    handleOpenScaleAndCrop,
    handleSetPageBackground,
    handleRemovePageBackground,
  };
};

export default useElementActions;
