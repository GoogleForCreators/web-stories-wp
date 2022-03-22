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
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { PRESET_TYPES } from '../../../constants';
import updateProperties from '../../../components/sidebar/design/updateProperties';
import useApplyStyle from '../../../components/styleManager/useApplyStyle';
import getUpdatedSizeAndPosition from '../../../utils/getUpdatedSizeAndPosition';
import { getTextPresets } from '../../../utils/presetUtils';
import { useHistory, useStory } from '../..';
import { UNDO_HELP_TEXT } from './constants';

function getTextElementStyles(element, animation) {
  const { textStyles } = getTextPresets(
    [element.styles],
    {
      textStyles: [],
      colors: [],
    },
    PRESET_TYPES.STYLE
  );
  const { colors } = getTextPresets(
    [element.styles],
    {
      textStyles: [],
      colors: [],
    },
    PRESET_TYPES.COLOR
  );
  const { content, ...copiedElementStyles } = element.styles;
  return {
    ...copiedElementStyles,
    ...textStyles[0],
    ...colors[0].color,
    animation,
    border: copiedElementStyles.border || null,
  };
}

/**
 * Creates the right click menu copy/paste actions.
 *
 * @return {Object} Right click menu copy/paste actions
 */
const useCopyPasteActions = () => {
  const undo = useHistory(({ actions }) => actions.undo);
  const {
    addAnimations,
    copySelectedElement,
    copiedElementState,
    selectedElement,
    selectedElementType,
    selectedElementAnimations,
    updateSelectedElements,
    isSelectedElementBackground,
  } = useStory(({ state, actions }) => ({
    addAnimations: actions.addAnimations,
    copiedElementState: state.copiedElementState,
    copySelectedElement: actions.copySelectedElement,
    selectedElement: state.selectedElements?.[0],
    selectedElementType: state.selectedElements?.[0]?.type,
    isSelectedElementBackground: state.selectedElements?.[0]?.isBackground,
    selectedElementAnimations: state.selectedElementAnimations,
    updateSelectedElements: actions.updateSelectedElements,
  }));

  const showSnackbar = useSnackbar((value) => value.showSnackbar);

  // Needed to not pass stale refs of `undo` to snackbar
  const undoRef = useRef(undo);
  undoRef.current = undo;

  /**
   * Copy the styles and animations of the selected element.
   */
  const handleCopyStyles = useCallback(() => {
    copySelectedElement();

    showSnackbar({
      actionLabel: __('Undo', 'web-stories'),
      dismissible: false,
      message: __('Copied style.', 'web-stories'),
      onAction: () => {
        undoRef.current();

        trackEvent('context_menu_action', {
          name: 'undo_copy_styles',
          element: selectedElementType,
          isBackground: isSelectedElementBackground,
        });
      },
      actionHelpText: UNDO_HELP_TEXT,
    });

    trackEvent('context_menu_action', {
      name: 'copy_styles',
      element: selectedElementType,
      isBackground: isSelectedElementBackground,
    });
  }, [
    copySelectedElement,
    showSnackbar,
    selectedElementType,
    isSelectedElementBackground,
  ]);

  const pushUpdate = useCallback(
    (update, commitValues) => {
      updateSelectedElements({
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
    },
    [updateSelectedElements]
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

    if (!id || selectedElementType !== copiedElementState.type) {
      return;
    }

    // Delete old animation if one exists
    const oldAnimationToDelete = selectedElementAnimations.length
      ? { ...selectedElementAnimations[0], delete: true }
      : undefined;

    // Create new animations
    const newAnimations = copiedElementState.animations.map((animation) => ({
      ...animation,
      id: uuidv4(),
      targets: [selectedElement.id],
    }));

    addAnimations({ animations: newAnimations });

    // Text elements need the text styles extracted from content before
    // applying to the other text
    if (
      copiedElementState.type === 'text' &&
      copiedElementState.styles.content
    ) {
      const updatedElementStyles = getTextElementStyles(
        copiedElementState,
        oldAnimationToDelete
      );
      handleApplyStyle(updatedElementStyles);
    } else {
      // Add styles and animations to element
      updateSelectedElements({
        properties: (currentProperties) =>
          updateProperties(
            currentProperties,
            {
              ...copiedElementState.styles,
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
          isBackground: isSelectedElementBackground,
        });
      },
      actionHelpText: UNDO_HELP_TEXT,
    });

    trackEvent('context_menu_action', {
      name: 'paste_styles',
      element: selectedElementType,
      isBackground: isSelectedElementBackground,
    });
  }, [
    addAnimations,
    copiedElementState,
    handleApplyStyle,
    selectedElement,
    selectedElementAnimations,
    showSnackbar,
    updateSelectedElements,
    selectedElementType,
    isSelectedElementBackground,
  ]);

  return {
    copiedElementType: copiedElementState?.type,
    handleCopyStyles,
    handlePasteStyles,
  };
};

export default useCopyPasteActions;
