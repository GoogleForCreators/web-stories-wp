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
import type { Story } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { RestoreProps, ReducerState } from '../../../../types';

/**
 * Restore internal state completely from given state.
 *
 * Some validation is performed:
 *
 * - `pages` must be an array (if not, nothing happens).
 * - `current` must point to a legal page, if at least one page exists.
 * - `selection` is an array.
 * - `story` is an object.
 */
export const restore = (
  draft: ReducerState,
  { pages, current, selection, story, capabilities }: RestoreProps
): ReducerState | undefined => {
  if (!Array.isArray(pages) || pages.length === 0) {
    return undefined;
  }

  const newReducerState = typeof story === 'object' ? story : ({} as Story);
  const newCapabilities = typeof capabilities === 'object' ? capabilities : {};
  const oldCurrent = current ?? draft.current;
  const newCurrent = pages.some(({ id }) => id === oldCurrent)
    ? oldCurrent
    : pages[0].id;
  const newSelection = Array.isArray(selection) ? selection : [];

  return {
    pages,
    current: newCurrent,
    selection: newSelection,
    story: newReducerState,
    animationState: draft.animationState,
    capabilities: newCapabilities,
    copiedElementState: {},
  };
};

export default produce(restore);
