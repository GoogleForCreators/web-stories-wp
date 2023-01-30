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
import { useCallback } from '@googleforcreators/react';
import { ElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../story';
import updateProperties from '../../components/style/updateProperties';
import { RESET_DEFAULTS, RESET_PROPERTIES } from './constants';

function useResetProperties() {
  const { selectedElementAnimations, updateElementsById } =
    useStory(
    ({
      state: { selectedElementAnimations },
      actions: { updateElementsById },
    }) => ({
      selectedElementAnimations,
      updateElementsById,
    })
  );
  /**
   * Reset properties on an element. Shows a snackbar once the properties
   * have been reset.
   *
   * @param {string} elementId the id of the element
   * @param {Array.<string>} properties The properties of the element to update
   * @return {void}
   */
  const handleResetProperties = useCallback(
    (elementType, elementId, properties) => {
      const newProperties = {};
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

  return handleResetProperties;
}

export default useResetProperties;
