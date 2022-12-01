/*
 * Copyright 2022 Google LLC
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
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import type {
  AddElementsAcrossPagesProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';
import { addPage } from './addPage';
import { addElements } from './addElements';

/**
 * Add multiple elements across individual pages.
 *
 * Adds N elements to N pages in the given order.
 *
 * Selection is unchanged afterwards.
 */
const addElementsAcrossPages = (
  draft: ReducerStateDraft,
  { page, position, elements }: AddElementsAcrossPagesProps
) => {
  elements.forEach((element, index) => {
    // Ensure every newly added page has a unique ID.
    const pageId = uuidv4();
    const uniquePage = {
      ...page,
      elements: page.elements.map((el) => ({ ...el, id: uuidv4() })),
      id: pageId,
    };

    addPage(draft, {
      page: uniquePage,
      position: position + index + 1,
      updateSelection: false,
    });

    addElements(draft, { elements: [element], pageId, updateSelection: false });
  });
};

export default produce<ReducerState, [AddElementsAcrossPagesProps]>(
  addElementsAcrossPages
);
