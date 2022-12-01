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
  AddGroupProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';

/**
 * Add a group to the current page groups list (id, name).
 */
export const addGroup = (
  draft: ReducerStateDraft,
  { groupId, name, isLocked = false }: AddGroupProps
) => {
  if (!groupId || !name) {
    return;
  }

  const page = draft.pages.find(({ id }) => id === draft.current);
  if (!page) {
    return;
  }

  if (!page.groups) {
    page.groups = {};
  }
  page.groups[groupId] = { name, isLocked };
};

export default produce<ReducerState, [AddGroupProps]>(addGroup);
