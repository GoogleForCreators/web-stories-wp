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
  ReducerState,
  ReducerStateDraft,
  UpdateGroupProps,
} from '../../../../types';

/**
 * Update group by id.
 */
export const updateGroup = (
  draft: ReducerStateDraft,
  { groupId, properties }: UpdateGroupProps
) => {
  if (!groupId) {
    return;
  }

  const page = draft.pages.find(({ id }) => id === draft.current);
  if (!page) {
    return;
  }
  const { groups } = page;

  // Should only update existing groups
  if (!groups?.[groupId]) {
    return;
  }

  Object.assign(groups[groupId], properties);
};

export default produce<ReducerState, [UpdateGroupProps]>(updateGroup);
