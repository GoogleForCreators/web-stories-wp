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
  SetCurrentPageProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';

/**
 * Set current page to the given id.
 *
 * If id doesn't match an existing page, nothing happens.
 *
 * If page is changed, selection is cleared
 */
export const setCurrentPage = (
  draft: ReducerStateDraft,
  { pageId }: SetCurrentPageProps
) => {
  const pageExists = draft.pages.some(({ id }) => id === pageId);
  const pageIsAlreadyCurrent = draft.current === pageId;
  if (!pageExists || pageIsAlreadyCurrent) {
    return;
  }

  draft.current = pageId;
  draft.selection = [];
};

export default produce<ReducerState, [SetCurrentPageProps]>(setCurrentPage);
