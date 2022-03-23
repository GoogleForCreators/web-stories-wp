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
import { v4 as uuidv4 } from 'uuid';
import { objectWithout } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import getDefinitionForType from './getDefinitionForType';

const createNewElement = (type, attributes = {}) => {
  const element = getDefinitionForType(type);
  if (!element) {
    throw new Error(`Unknown element type: ${type}`);
  }
  const { defaultAttributes } = element;
  const newElement = {
    ...defaultAttributes,
    ...attributes,
    type,
    id: uuidv4(),
  };
  // There's an exception for the background shape that should not get all the default attributes.
  if (attributes.isDefaultBackground) {
    return objectWithout(newElement, ['backgroundColor']);
  }
  return newElement;
};

export default createNewElement;
