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
import { getDefinitionForType, ELEMENT_TYPES } from '../../elements';
import objectPick from '../../utils/objectPick';

const elementTypes = Object.values(ELEMENT_TYPES);

/**
 * Extracts the styles from an element based off of the element type.
 *
 * @param {Object} element the element
 * @return {Object} an object with a subset of properties of the original element. The properties
 * should all be properties that define styles on that element.
 */
export const getElementStyles = (element) => {
  if (!element || !element?.type || !elementTypes.includes(element.type)) {
    return null;
  }

  const { clearableAttributes } = getDefinitionForType(element.type);

  return objectPick(element, Object.keys(clearableAttributes));
};

/**
 *
 * @param {string} type the type of the element to update
 * @return {Object|null} the default properties for the element type.
 * Return `null` if `type` isn't valid.
 */
export const getDefaultPropertiesForType = (type) => {
  if (!type || !elementTypes.includes(type)) {
    return null;
  }

  const { clearableAttributes } = getDefinitionForType(type);

  return clearableAttributes;
};
