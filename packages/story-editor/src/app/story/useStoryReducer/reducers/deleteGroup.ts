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

/**
 * Internal dependencies
 */
import type {
  DeleteGroupProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';
import { deleteElements } from './deleteElements';

/**
 * Delete group by id.
 */
const deleteGroup = produce<ReducerState, [DeleteGroupProps]>(
  (
    draft: ReducerStateDraft,
    { groupId, includeElements = false }: DeleteGroupProps
  ) => {
    const page = draft.pages.find(({ id }) => id === draft.current);
    if (!page) {
      return;
    }
    const { elements, groups } = page;
    if (!groupId || !groups?.[groupId]) {
      return;
    }

    // Delete the group object completely
    delete groups[groupId];

    // If includeElements is true, remove elements as well
    // Otherwise just unset groupId on elements
    const groupElements = elements.filter((el) => el.groupId === groupId);
    if (includeElements) {
      const elementIds = groupElements.map(({ id }) => id);
      deleteElements(draft, { elementIds });
    } else {
      groupElements.forEach((el) => {
        delete el.groupId;
      });
    }
  }
);

export default deleteGroup;
