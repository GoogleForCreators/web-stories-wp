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
import type { Page } from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import createNewElement from './createNewElement';
import duplicateElement from './duplicateElement';

interface AccValue {
  elements: Element[];
  animations: Animation[];
}

function duplicatePage(oldPage: Page): Page {
  const { elements: oldElements, animations: oldAnimations, ...rest } = oldPage;

  const { elements, animations } = oldElements.reduce(
    (acc: AccValue, oldElement) => {
      const { element, elementAnimations } = duplicateElement({
        element: oldElement,
        animations: oldAnimations,
      });
      return {
        elements: [...acc.elements, element],
        animations: [...acc.animations, ...elementAnimations],
      } as AccValue;
    },
    {
      elements: [],
      animations: [],
    } as AccValue
  );

  const newAttributes = {
    elements,
    animations,
    ...rest,
  };

  return createNewElement('page', newAttributes) as Page;
}

export default duplicatePage;
