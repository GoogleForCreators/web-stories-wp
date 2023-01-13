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
import {
  Icons,
  prettifyShortcut,
  useSnackbar,
} from '@googleforcreators/design-system';
import { useCallback, useMemo, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { Element, ElementId, ElementType } from '@googleforcreators/elements';
import { __, sprintf } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { states } from '../highlights';
import { useStory } from '../story';
import type { QuickAction } from '../../types';
import updateProperties from '../../components/style/updateProperties';
import { useHistory } from '../history';
import { ACTIONS, RESET_DEFAULTS, RESET_PROPERTIES } from './constants';

function useCommonActions({
  actionProps,
  selectedElement,
  handleFocusPanel,
  resetProperties,
}): QuickAction[] {
  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);
  const { currentPageNumber, selectedElementAnimations, updateElementsById } =
    useStory(
      ({
        state: { currentPageNumber, selectedElementAnimations },
        actions: { updateElementsById },
      }) => ({
        currentPageNumber,
        selectedElementAnimations,
        updateElementsById,
      })
    );

  const { undo } = useHistory(({ actions: { undo } }) => ({
    undo,
  }));
  const undoRef = useRef(undo);
  undoRef.current = undo;

  /**
   * Reset properties on an element. Shows a snackbar once the properties
   * have been reset.
   *
   * @param {string} elementId the id of the element
   * @param {Array.<string>} properties The properties of the element to update
   * @return {void}
   */
  const handleResetProperties = useCallback(
    (elementType: ElementType, elementId: ElementId, properties: string[]) => {
      const newProperties: Partial<Element> = {};
      // Choose properties to clear
      if (properties.includes(RESET_PROPERTIES.OVERLAY)) {
        newProperties.overlay = null;
      }

      if (properties.includes(RESET_PROPERTIES.ANIMATION)) {
        // this is the only place where we're updating both animations and other
        // properties on an element. updateElementsById only accepts if you upate
        // one or the other, so we're upating animations if needed here separately
        updateElementsById({
          elementIds: [elementId],
          properties: (currentProperties) =>
            updateProperties(
              currentProperties,
              {
                animation: { ...selectedElementAnimations?.[0], delete: true },
              },
              /* commitValues */ true
            ),
        });
      }

      if (properties.includes(RESET_PROPERTIES.STYLES)) {
        newProperties.opacity = 100;
        newProperties.border = null;
        newProperties.borderRadius = null;
      }

      if (elementType === ElementType.Text) {
        newProperties.borderRadius = RESET_DEFAULTS.TEXT_BORDER_RADIUS;
      }

      updateElementsById({
        elementIds: [elementId],
        properties: (currentProperties) =>
          updateProperties(
            currentProperties,
            newProperties,
            /* commitValues */ true
          ),
      });
    },
    [selectedElementAnimations, updateElementsById]
  );

  /**
   * Reset element styles and show a confirmation snackbar. Clicking
   * the action in the snackbar adds the animations back to the element.
   *
   * @param {string} elementId the id of the element
   * @param {Array} resetProperties the properties that are to be reset ('animations', 'overlay')
   * @param {string} elementType the type of element being adjusted
   * @return {void}
   */
  const handleElementReset = useCallback(
    ({ elementId, resetProperties, elementType }) => {
      handleResetProperties(elementType, elementId, resetProperties);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Element properties have been reset', 'web-stories'),
        // Don't pass a stale version of `undo`
        onAction: () => {
          undoRef.current();

          void trackEvent('quick_action', {
            name: `undo_${ACTIONS.RESET_ELEMENT.trackingEventName}`,
            element: elementType,
            isBackground: true,
          });
        },
        actionHelpText: sprintf(
          /* translators: %s: Ctrl/Cmd + Z keyboard shortcut */
          __('Press %s to undo the last change', 'web-stories'),
          prettifyShortcut('mod+z')
        ),
      });
    },
    [handleResetProperties, showSnackbar]
  );

  const foregroundCommonActions: QuickAction[] = useMemo(() => {
    const handleFocusAnimationPanel = handleFocusPanel(states.Animation);
    const handleFocusLinkPanel = handleFocusPanel(states.Link);
    const commonActions = [];

    // Don't show the 'Add animation' button on the first page
    if (currentPageNumber > 1) {
      // 'Add animation' button
      commonActions.push({
        Icon: Icons.CircleSpeed,
        label: ACTIONS.ADD_ANIMATION.text,
        onClick: (evt) => {
          handleFocusAnimationPanel()(evt);

          trackEvent('quick_action', {
            name: ACTIONS.ADD_ANIMATION.trackingEventName,
            element: selectedElement?.type,
          });
        },
        ...actionProps,
      });
    }

    // 'Add link' button is always rendered
    commonActions.push({
      Icon: Icons.Link,
      label: ACTIONS.ADD_LINK.text,
      onClick: (evt) => {
        handleFocusLinkPanel()(evt);

        trackEvent('quick_action', {
          name: ACTIONS.ADD_LINK.trackingEventName,
          element: selectedElement?.type,
        });
      },
      ...actionProps,
    });

    // Only show 'Reset element' button for modified elements
    if (resetProperties.length > 0) {
      // 'Reset element' button
      commonActions.push({
        Icon: Icons.Eraser,
        label: ACTIONS.RESET_ELEMENT.text,
        onClick: () => {
          handleElementReset({
            elementId: selectedElement?.id,
            resetProperties,
            elementType: selectedElement?.type,
          });

          void trackEvent('quick_action', {
            name: ACTIONS.RESET_ELEMENT.trackingEventName,
            element: selectedElement?.type,
          });
        },
        separator: 'top',
        ...actionProps,
      });
    }
    return commonActions;
  }, [
    currentPageNumber,
    selectedElement?.id,
    selectedElement?.type,
    actionProps,
    handleFocusPanel,
    handleElementReset,
    resetProperties,
  ]);

  return foregroundCommonActions;
}

export default useCommonActions;
