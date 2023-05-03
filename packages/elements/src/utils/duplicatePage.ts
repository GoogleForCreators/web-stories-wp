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
import type { Page } from '../types';
import createPage from './createPage';
import duplicateElement from './duplicateElement';

// Required<> is a reverse Partial<> - removing the optional
// part from the animations property
type ElementsAndAnimationsOnly = Required<
  Pick<Page, 'elements' | 'animations'>
>;

const duplicatePage = (oldPage: Page) => {
  const {
    elements: oldElements,
    animations: oldAnimations = [],
    ...rest
  } = oldPage;

  const elementAndAnimations: ElementsAndAnimationsOnly =
    oldElements.reduce<ElementsAndAnimationsOnly>(
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

  const newAttributes: Partial<Page> = {
    ...elementAndAnimations,
    ...rest,
  };

  return createPage(newAttributes);
};

export default duplicatePage;
