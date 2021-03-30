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
import { EditorState, Modifier } from 'draft-js';
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import getPastedBlocks from './getPastedBlocks';
import { COLOR } from './customConstants';
import { getPrefixStylesInSelection } from './styleManipulation';

/*
 * This hook returns a function to handle text pasted while in edit-mode.
 *
 * Compare this with `usePasteTextContent` that handles generally pasting
 * text without being in text edit-mode anywhere.
 */
function useHandlePastedText(setEditorState) {
  return useCallback(
    (text, html, state) => {
      const content = state.getCurrentContent();
      const selection = state.getSelection();
      let newState, stateChange;
      if (html) {
        // Get the styles of the current selection context (collapsed or not),
        // that should be applied to the entirety of the pasted HTML.
        // In this instance, we only care about the text color - all other existing
        // styles will be ignored and overwritten by pasted content.
        let existingStyles = getPrefixStylesInSelection(state, COLOR);
        if (existingStyles.length > 1) {
          // If selection has multiple colors, use only the first one
          existingStyles = existingStyles.slice(0, 1);
        }
        const blocks = getPastedBlocks(html, existingStyles);
        newState = Modifier.replaceWithFragment(content, selection, blocks);
        stateChange = 'insert-fragment';
      } else {
        const style = state.getCurrentInlineStyle();
        newState = Modifier.replaceText(content, selection, text, style);
        stateChange = 'insert-characters';
      }
      const result = EditorState.push(state, newState, stateChange);
      setEditorState(result);
      return true;
    },
    [setEditorState]
  );
}

export default useHandlePastedText;
