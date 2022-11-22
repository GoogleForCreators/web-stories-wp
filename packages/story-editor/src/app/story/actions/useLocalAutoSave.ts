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
import { useCallback } from '@googleforcreators/react';
import { sessionStore } from '@googleforcreators/design-system';
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import getSessionStorageKey from '../../../utils/getSessionStorageKey';
import type { ReducerState, Capabilities, Restore } from '../../../types';

interface UseLocalAutoSaveProps {
  restore: Restore;
  storyId: number;
  pages: Page[];
  capabilities: Capabilities;
  isNew: boolean;
}
function useLocalAutoSave({
  restore,
  storyId,
  pages,
  capabilities,
  isNew,
}: UseLocalAutoSaveProps) {
  const restoreLocalAutoSave = useCallback(() => {
    const existingAutoSave = sessionStore.getItemByKey(
      getSessionStorageKey(storyId, isNew)
    );
    // If either of the values is missing, nothing to do.
    if (!existingAutoSave?.story || !existingAutoSave?.pages) {
      return;
    }

    restore({
      current: pages[0],
      selection: [],
      capabilities,
      ...existingAutoSave,
    } as Partial<ReducerState>);
  }, [restore, storyId, pages, capabilities, isNew]);

  return {
    restoreLocalAutoSave,
  };
}

export default useLocalAutoSave;
