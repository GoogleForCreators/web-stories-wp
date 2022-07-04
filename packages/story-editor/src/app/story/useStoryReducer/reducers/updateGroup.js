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
 * Update group by id.
 *
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {string} payload.groupId Group id
 * @param {number} payload.properties Object with properties to set for given group.
 */
export const updateGroup = (draft, { groupId, properties }) => {
  if (!groupId) {
    return;
  }

  const { groups } = draft.pages.find(({ id }) => id === draft.current);

  // Should only update existing groups
  if (!groups?.[groupId]) {
    return;
  }

  Object.assign(groups[groupId], properties);
};

export default produce(updateGroup);
