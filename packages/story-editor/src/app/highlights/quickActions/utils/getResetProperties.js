/*
 * Copyright 2021 Google LLC
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
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { RESET_PROPERTIES, RESET_DEFAULTS } from '../constants';

function isBorderRadiusDefault(element) {
  // text element presets have a different default border radius
  if (element?.type === ELEMENT_TYPES.TEXT && element?.borderRadius) {
    return (
      element.borderRadius.locked &&
      element.borderRadius.topLeft === RESET_DEFAULTS.TEXT_BORDER_RADIUS.topLeft
    );
  }
  // Otherwise if borderRadius is not present or radius is 0 return false to show reset
  return (
    !element?.borderRadius ||
    element.borderRadius === RESET_DEFAULTS.STANDARD_BORDER_RADIUS
  );
}
/**
 * Determines which properties on an element are to be reset when
 * the "clear" action is selected from a quick action menu
 *
 * @param {Object} selectedElement element currently selected
 * @param {Array.<Object>} selectedElementAnimations array of animations currently applied to the selected element
 * @return {Array.<string>} array of properties to reset on element
 */
const getResetProperties = (
  selectedElement,
  selectedElementAnimations = []
) => {
  if (!selectedElement) {
    return [];
  }

  const resetProperties = [];

  if (selectedElement?.overlay) {
    resetProperties.push(RESET_PROPERTIES.OVERLAY);
  }
  if (selectedElementAnimations?.length) {
    resetProperties.push(RESET_PROPERTIES.ANIMATION);
  }

  if (
    selectedElement?.opacity < 100 ||
    !isBorderRadiusDefault(selectedElement) ||
    selectedElement?.border
  ) {
    resetProperties.push(RESET_PROPERTIES.STYLES);
  }
  return resetProperties;
};

export default getResetProperties;
