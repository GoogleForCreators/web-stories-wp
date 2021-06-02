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
import { sprintf, translateToInclusiveList, __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { ELEMENT_TYPE_COPY, RESET_LIST_COPY } from '../constants';

/**
 * Sets up the copy to display on snackbar in editor
 * when the 'clear' action is selected from a quick action menu
 *
 * @param {Array} resetProperties the element's properties to reset to default values
 * @param {string} elementType the type of element getting reset
 * @return {string} string to display in snackbar
 */
export const getSnackbarClearCopy = (resetProperties = [], elementType) => {
  const resetPropertiesAsCopy = resetProperties
    .map((property) => RESET_LIST_COPY[property])
    .filter((propertyCopy) => propertyCopy);
  const elementTypeAsCopy = ELEMENT_TYPE_COPY[elementType];
  if (resetPropertiesAsCopy.length <= 0) {
    return '';
  }

  return sprintf(
    /* translators: %1$s: list of element properties to be reset, %2$s is the element type */
    __('All %1$s were removed from the %2$s.', 'web-stories'),
    translateToInclusiveList(resetPropertiesAsCopy),
    elementTypeAsCopy
  );
};
