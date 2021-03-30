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
import getElementMask from './getElementMask';

/**
 * Determine whether an element can have a border.
 *
 * Only no-mask and masks with supportsBorder support border.
 *
 * @param {Object} element Element.
 * @return {boolean} Whether the element can have a border.
 */
function canElementHaveBorder(element) {
  const mask = getElementMask(element);
  return !mask || mask.supportsBorder;
}

export default canElementHaveBorder;
