/*
 * Copyright 2020 Google LLC
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
import { produce } from 'immer';
import type { State } from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import type { AddPageProps } from '../../../../types/storyProvider';
import { isInsideRange } from './utils';

/**
 * Insert page at the given position.
 *
 * If position is outside bounds or no position given, new page will be inserted after current page.
 *
 * Current page will be updated to point to the newly inserted page.
 *
 * New page must have at least one element, the default background element.
 *
 * Selection is cleared by default.
 */
export const addPage = (
  draft: State,
  { page, position, updateSelection = true }: AddPageProps
) => {
  // Ensure new page has at least one element
  if (!page.elements?.length) {
    return;
  }

  const isWithinBounds =
    position !== null && isInsideRange(position, 0, draft.pages.length);
  const currentPageIndex = draft.pages.findIndex(
    ({ id }) => id === draft.current
  );

  const insertionPoint = isWithinBounds ? position : currentPageIndex + 1;

  draft.pages.splice(insertionPoint, 0, page);
  if (updateSelection) {
    draft.current = page.id;
    draft.selection = [page.elements[0].id];
  }
};

export default produce(addPage);
