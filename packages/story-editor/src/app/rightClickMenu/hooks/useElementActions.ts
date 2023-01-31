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
import { elementIs } from '@googleforcreators/elements';
import { trackEvent } from '@googleforcreators/tracking';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useStory } from '../../story';
import { useHistory } from '../../history';
import { useCanvas } from '../../canvas';
import updateProperties from '../../../components/style/updateProperties';
import generateGroupName from '../../../utils/generateGroupName';
import { UNDO_HELP_TEXT } from './constants';

/**
 * Creates the right click menu element actions.
 *
 * @return Right click menu element actions
 */
const useElementActions = () => {
  const {
    clearBackgroundElement,
    duplicateElementsById,
    selectedElements,
    setBackgroundElement,
    updateElementsById,
    deleteGroupById,
    addGroup,
    groups,
    elements,
    arrangeElement,
  } = useStory(({ state, actions }) => ({
    clearBackgroundElement: actions.clearBackgroundElement,
    duplicateElementsById: actions.duplicateElementsById,
    selectedElements: state.selectedElements,
    setBackgroundElement: actions.setBackgroundElement,
    updateElementsById: actions.updateElementsById,
    addGroup: actions.addGroup,
    deleteGroupById: actions.deleteGroupById,
    groups: state.currentPage.groups,
    elements: state.currentPage?.elements || [],
    arrangeElement: actions.arrangeElement,
  }));
  const showSnackbar = useSnackbar((value) => value.showSnackbar);
  const setEditingElement = useCanvas(
    ({ actions }) => actions.setEditingElement
  );
  const {
    actions: { undo },
  } = useHistory();

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

    if (duplicateElementsById) {
      duplicateElementsById({
        elementIds: selectedElements.map(({ id }) => id),
      });
    }

    showSnackbar({
      actionLabel: __('Undo', 'web-stories'),
      dismissible: false,
      message: __('Duplicated elements.', 'web-stories'),
      // don't pass a stale reference for undo
      // need history updates to run so `undo` works correctly.
      onAction: () => {
        undoRef.current();

        void trackEvent('context_menu_action', {
          name: 'undo_duplicate_elements',
          elements: selectedElements.map((element) => element.type),
        });
      },
      actionHelpText: UNDO_HELP_TEXT,
    });

    void trackEvent('context_menu_action', {
      name: 'duplicate_elements',
      elements: selectedElements.map((element) => element.type),
    });
  }, [duplicateElementsById, selectedElements, showSnackbar]);

  const handleGroupSelectedElements = useCallback(() => {
    if (!selectedElements.length) {
      return;
    }

    const groupId = uuidv4();
    const name = generateGroupName(groups);
    if (addGroup) {
      addGroup({ groupId, name });
    }
    if (updateElementsById) {
      updateElementsById({
        elementIds: selectedElements.map(({ id }) => id),
        properties: (currentProperties) =>
          updateProperties(
            currentProperties,
            {
              groupId,
            },
            /* commitValues */ true
          ),
      });
    }
    // Fix the order
    const elementFromGroupWithHighestPosition = Math.max(
      ...selectedElements.map((el) =>
        elements.findIndex(({ id }) => id === el?.id)
      )
    );
    for (const [index, element] of selectedElements.reverse().entries()) {
      const position = elements.findIndex(({ id }) => id === element?.id);
      if (position !== elementFromGroupWithHighestPosition) {
        const newPosition = elementFromGroupWithHighestPosition - index;
        if (arrangeElement) {
          arrangeElement({
            elementId: element.id,
            position: newPosition,
          });
        }
      }
    }
  }, [
    selectedElements,
    updateElementsById,
    addGroup,
    groups,
    arrangeElement,
    elements,
  ]);

  const handleUngroupSelectedElements = useCallback(() => {
    if (!selectedElements.length) {
      return;
    }

    // this will remove the group but keep the elements
    if (deleteGroupById && selectedElements) {
      deleteGroupById({ groupId: selectedElements[0]?.groupId });
    }

    if (updateElementsById) {
      updateElementsById({
        elementIds: selectedElements.map(({ id }) => id),
        properties: (currentProperties) =>
          updateProperties(
            currentProperties,
            {
              groupId: null,
            },
            /* commitValues */ true
          ),
      });
    }
  }, [selectedElements, updateElementsById, deleteGroupById]);

  /**
   * Set element as the element being 'edited'.
   *
   * @param {Event} evt The triggering event
   */
  const handleOpenScaleAndCrop = useCallback(() => {
    const selectedElement = selectedElements?.[0];

    if (selectedElement) {
      setEditingElement(selectedElement.id);

      void trackEvent('context_menu_action', {
        name: 'open_scale_and_crop',
        element: selectedElement.type,
        isBackground:
          elementIs.backgroundable(selectedElement) &&
          selectedElement.isBackground,
      });
    }
  }, [selectedElements, setEditingElement]);

  /**
   * Set currently selected element as the page's background.
   */
  const handleSetPageBackground = useCallback(() => {
    const selectedElement = selectedElements?.[0];

    if (
      selectedElement &&
      elementIs.backgroundable(selectedElement) &&
      !selectedElement.isBackground
    ) {
      if (setBackgroundElement) {
        setBackgroundElement({ elementId: selectedElement.id });
      }

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Set page background.', 'web-stories'),
        // don't pass a stale reference for undo
        // need history updates to run so `undo` works correctly.
        onAction: () => {
          undoRef.current();

          void trackEvent('context_menu_action', {
            name: 'undo_set_page_background',
            element: selectedElement.type,
            isBackground:
              elementIs.backgroundable(selectedElement) &&
              selectedElement.isBackground,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });

      void trackEvent('context_menu_action', {
        name: 'set_as_page_background',
        element: selectedElement.type,
        isBackground:
          elementIs.backgroundable(selectedElement) &&
          selectedElement.isBackground,
      });
    }
  }, [selectedElements, setBackgroundElement, showSnackbar]);

  /**
   * Remove media from background and clear opacity and overlay.
   */
  const handleRemovePageBackground = useCallback(() => {
    const selectedElement = selectedElements?.[0];

    if (
      selectedElement &&
      elementIs.backgroundable(selectedElement) &&
      selectedElement.isBackground &&
      updateElementsById
    ) {
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

      if (clearBackgroundElement) {
        clearBackgroundElement();
      }

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Removed page background.', 'web-stories'),
        // don't pass a stale reference for undo
        // need history updates to run so `undo` works correctly.
        onAction: () => {
          undoRef.current();

          void trackEvent('context_menu_action', {
            name: 'undo_remove_page_background',
            elements: selectedElement.type,
            isBackground:
              elementIs.backgroundable(selectedElement) &&
              selectedElement.isBackground,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });

      void trackEvent('context_menu_action', {
        name: 'remove_media_from_background',
        element: selectedElement.type,
        isBackground:
          elementIs.backgroundable(selectedElement) &&
          selectedElement.isBackground,
      });
    }
  }, [
    clearBackgroundElement,
    selectedElements,
    showSnackbar,
    updateElementsById,
  ]);

  return {
    handleDuplicateSelectedElements,
    handleGroupSelectedElements,
    handleUngroupSelectedElements,
    handleOpenScaleAndCrop,
    handleSetPageBackground,
    handleRemovePageBackground,
  };
};

export default useElementActions;
