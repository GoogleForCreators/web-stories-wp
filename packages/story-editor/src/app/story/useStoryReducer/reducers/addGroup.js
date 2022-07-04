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
 * Add a group to the current page groups list (id, name).
 *
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {string} payload.groupId Group id
 * @param {string} payload.name Group name
 * @param {boolean} payload.isLocked Is group locked
 */
export const addGroup = (draft, { groupId, name, isLocked = false }) => {
  if (!groupId || !name) {
    return;
  }

  const page = draft.pages.find(({ id }) => id === draft.current);

  if (!page.groups) {
    page.groups = {};
  }
  page.groups[groupId] = { name, isLocked };
};

export default produce(addGroup);
