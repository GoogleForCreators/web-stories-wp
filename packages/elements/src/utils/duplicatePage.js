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

/**
 * Internal dependencies
 */
import createNewElement from './createNewElement';

const duplicatePage = (oldPage) => {
  const { elements: oldElements, animations: oldAnimations, ...rest } = oldPage;

  // Ensure all existing elements get new ids
  const elementIdTransferMap = {};
  const elements = oldElements.map(({ type, ...attrs }) => {
    const newElement = createNewElement(type, attrs);
    elementIdTransferMap[attrs.id] = newElement.id;
    return newElement;
  });
  const animations = (oldAnimations || [])
    .map((animation) => ({
      ...animation,
      id: uuidv4(),
      targets: animation.targets
        .map((target) => elementIdTransferMap[target])
        .filter((v) => v),
    }))
    // This is just a safety measure to remove animations with no targets from schema.
    .filter((animation) => animation.targets.length);

  const newAttributes = {
    elements,
    animations,
    ...rest,
  };

  return createNewElement('page', newAttributes);
};

export default duplicatePage;
