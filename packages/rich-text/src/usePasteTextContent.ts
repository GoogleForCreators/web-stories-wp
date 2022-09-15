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
import { EditorState, ContentState } from 'draft-js';
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import getPastedBlocks from './getPastedBlocks';
import customExport from './customExport';

/*
 * This hook returns a function to handle text pasted with no specific focus.
 *
 * Compare this with `useHandlePastedText` that handles pasting text while being
 * in text edit-mode.
 */
// @todo this really returns the inserted element and props is Partial<Element>, so is preset.
function usePasteTextContent(
  insertElement: (
    type: string,
    props: Record<string, unknown>,
    asBackground?: boolean
  ) => Record<string, unknown>,
  preset: Record<string, unknown>
) {
  return useCallback(
    (html: string) => {
      const blockMap = getPastedBlocks(html);
      const blockArray = blockMap.toArray();
      const contentState = ContentState.createFromBlockArray(blockArray);
      const editorState = EditorState.createWithContent(contentState);
      const validContent = customExport(editorState);
      if (!validContent) {
        return false;
      }
      insertElement('text', {
        ...preset,
        content: validContent,
      });
      return true;
    },
    [insertElement, preset]
  );
}

export default usePasteTextContent;
