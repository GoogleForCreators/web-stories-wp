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
import type { ElementBox } from '@googleforcreators/units';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import type { DefaultBackgroundElement, Element, ElementType } from '../types';

/**
 * Internal dependencies
 */
import getDefinitionForType from './getDefinitionForType';

function isDefaultBackgroundElement(
  e: Partial<Element>
): e is DefaultBackgroundElement {
  return 'isDefaultBackground' in e;
}
type Attributes = Partial<Element> & ElementBox;

// If we're copying an existing default background element into a new one,
// we should ignore the default background color from the element (which will
// be a shape)
function getDefaultAttributes(
  defaultAttributes: Partial<Element>,
  attributes: Attributes
): Partial<Element> {
  if (
    isDefaultBackgroundElement(attributes) &&
    isDefaultBackgroundElement(defaultAttributes) &&
    attributes.isDefaultBackground
  ) {
    const { backgroundColor, ...defaultAttributesWithoutColor } =
      defaultAttributes;
    return defaultAttributesWithoutColor;
  }
  return defaultAttributes;
}

function createNewElement(
  type: ElementType,
  attributes: Attributes = {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    rotationAngle: 0,
  }
): Element {
  const element = getDefinitionForType(type);
  if (!element) {
    throw new Error(`Unknown element type: ${type}`);
  }
  const defaultAttributes = getDefaultAttributes(
    element.defaultAttributes,
    attributes
  );
  const newElement: Element = {
    ...defaultAttributes,
    ...attributes,
    type,
    id: uuidv4(),
  };

  return newElement;
}

export default createNewElement;
