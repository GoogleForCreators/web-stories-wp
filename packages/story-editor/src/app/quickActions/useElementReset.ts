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
  useSnackbar,
  prettifyShortcut,
} from '@googleforcreators/design-system';
import { useCallback, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import {
  Element,
  ElementId,
  elementIs,
  ElementType,
} from '@googleforcreators/elements';
import { __, sprintf } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useHistory } from '../history';
import { useStory } from '../story';
import updateProperties from '../../components/style/updateProperties';
import { ACTIONS, RESET_DEFAULTS, ResetProperties } from './constants';

function useElementReset() {
  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);
  const { selectedElementAnimations, updateElementById } = useStory(
    ({
      state: { selectedElementAnimations },
      actions: { updateElementById },
    }) => ({
      selectedElementAnimations,
      updateElementById,
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
    <E extends Element = Element>(
      elementType: ElementType,
      elementId: ElementId,
      properties: string[]
    ) => {
      const newProperties: Partial<E> = {};
      // Choose properties to clear
      if (
        elementIs.media(newProperties) &&
        properties.includes(ResetProperties.Overlay)
      ) {
        newProperties.overlay = null;
      }

      const firstAnimation = selectedElementAnimations?.[0];
      if (properties.includes(ResetProperties.Animation) && firstAnimation) {
        // this is the only place where we're updating both animations and other
        // properties on an element. updateElementsById only accepts if you upate
        // one or the other, so we're upating animations if needed here separately
        updateElementById({
          elementId: elementId,
          properties: () => ({
            animation: { ...firstAnimation, delete: true },
          }),
        });
      }

      if (properties.includes(ResetProperties.Styles)) {
        newProperties.opacity = 100;
        newProperties.border = undefined;
        newProperties.borderRadius = undefined;
      }

      if (elementType === ElementType.Text) {
        newProperties.borderRadius = RESET_DEFAULTS.TEXT_BORDER_RADIUS;
      }

      updateElementById({
        elementId: elementId,
        properties: (currentProperties: E) =>
          updateProperties(
            currentProperties,
            newProperties,
            /* commitValues */ true
          ),
      });
    },
    [selectedElementAnimations, updateElementById]
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
    ({
      elementId,
      resetProperties,
      elementType,
    }: {
      elementId: ElementId;
      resetProperties: string[];
      elementType: ElementType;
    }) => {
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

  return handleElementReset;
}

export default useElementReset;
