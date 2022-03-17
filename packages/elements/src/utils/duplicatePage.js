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
import { objectWithout } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import createNewElement from './createNewElement';
import duplicateElement from './duplicateElement';

const duplicatePage = (oldPage) => {
  // Remove title and postId for inserting the page.
  const {
    elements: oldElements,
    animations: oldAnimations,
    postId,
    title,
    ...rest
  } = oldPage;

  // Remove title and templateId for inserting the page.
  const cleanPage = objectWithout(rest, ['postId', 'title']);

  const { elements, animations } = oldElements.reduce(
    ({ elements, animations }, oldElement) => {
      const { element, elementAnimations } = duplicateElement({
        element: oldElement,
        animations: oldAnimations,
      });
      return {
        elements: [...elements, element],
        animations: [...animations, ...elementAnimations],
      };
    },
    {
      elements: [],
      animations: [],
    }
  );

  const newAttributes = {
    elements,
    animations,
    ...cleanPage,
  };

  return createNewElement('page', newAttributes);
};

export default duplicatePage;
