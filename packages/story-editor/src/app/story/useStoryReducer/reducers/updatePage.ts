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
import { PAGE_RESERVED_PROPERTIES } from '../types';
import type {
  UpdatePageProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';
import { objectWithout } from './utils';

/**
 * Update page by id or current page if no id given.
 *
 * If id doesn't exist, nothing happens.
 *
 * Current page and selection is unchanged.
 */
export const updatePage = (
  draft: ReducerStateDraft,
  { pageId, properties }: UpdatePageProps
) => {
  const idToUpdate = pageId === null ? (draft.current as string) : pageId;
  const page = draft.pages.find(({ id }) => id === idToUpdate);
  if (!page) {
    return;
  }
  const allowedProperties = objectWithout(properties, PAGE_RESERVED_PROPERTIES);
  Object.assign(page, allowedProperties);
};

export default produce<ReducerState, [UpdatePageProps]>(updatePage);
