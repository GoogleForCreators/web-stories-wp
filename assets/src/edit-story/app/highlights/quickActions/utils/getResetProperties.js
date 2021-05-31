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
 * Internal dependencies
 */
import { RESET_PROPERTIES } from '../constants';

/**
 * Determines which properties on an element are to be reset when
 * the "clear" action is selected from a quick action menu
 *
 * @param {Object} selectedElement element currently selected
 * @param {Array.<Object>} selectedElementAnimations array of animations currently applied to the selected element
 * @return {Array.<string>} array of properties to reset on element
 */
export const getResetProperties = (
  selectedElement,
  selectedElementAnimations = []
) => {
  const resetProperties = [];

  if (selectedElement?.backgroundOverlay) {
    resetProperties.push(RESET_PROPERTIES.BACKGROUND_OVERLAY);
  }
  if (selectedElementAnimations?.length) {
    resetProperties.push(RESET_PROPERTIES.ANIMATION);
  }
  return resetProperties;
};
