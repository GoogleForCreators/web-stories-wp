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
import { useEffect, useState } from 'react';
import { EditorState, Modifier } from 'draft-js';

const FAUX_SELECTION = 'CUSTOM-FAUX';

function isEqualSelectionIgnoreFocus(a, b) {
  if (!a || !b) {
    return false;
  }
  const aWithoutFocus = a.serialize().replace(/has focus: .*$/i, '');
  const bWithoutFocus = b.serialize().replace(/has focus: .*$/i, '');
  return aWithoutFocus === bWithoutFocus;
}

/**
 * A hook to properly set and remove faux selection style.
 *
 * If current selection in editor is unfocused, set faux style on current selection
 * else, if current selection in editor is focused, remove faux style from entire editor
 *
 * @param {Object} editorState  Current editor state
 * @param {Function} setEditorState  Callback to update current editor state
 * @return {void}
 */
export function useFauxSelection(editorState, setEditorState) {
  const [fauxSelection, setFauxSelection] = useState(null);
  useEffect(() => {
    if (!editorState) {
      setFauxSelection(null);
      return;
    }
    const content = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const isFocused = currentSelection?.getHasFocus();
    const hasSelectionChanged = !isEqualSelectionIgnoreFocus(
      fauxSelection,
      currentSelection
    );
    const hasFauxSelection = Boolean(fauxSelection);

    if (!isFocused && !hasFauxSelection) {
      // Get new content with style applied to selection
      const contentWithFaux = Modifier.applyInlineStyle(
        content,
        currentSelection,
        FAUX_SELECTION
      );

      // Push to get a new state
      const stateWithFaux = EditorState.push(
        editorState,
        contentWithFaux,
        'change-inline-style'
      );

      // Save that as the next editor state
      setEditorState(stateWithFaux);

      // And remember what we marked
      setFauxSelection(currentSelection);
    }

    if (isFocused && hasSelectionChanged && hasFauxSelection) {
      setEditorState((oldEditorState) => {
        try {
          // Get new content with style removed from old selection
          const contentWithoutFaux = Modifier.removeInlineStyle(
            oldEditorState.getCurrentContent(),
            fauxSelection,
            FAUX_SELECTION
          );

          // Push to get a new state
          const stateWithoutFaux = EditorState.push(
            oldEditorState,
            contentWithoutFaux,
            'change-inline-style'
          );

          // Force selection
          const selectedState = EditorState.forceSelection(
            stateWithoutFaux,
            oldEditorState.getSelection()
          );

          // Save that as the next editor state
          return selectedState;
        } catch (e) {
          // If the component has unmounted/remounted, some of the above might throw
          // if so, just ignore it and return old state
          return oldEditorState;
        }
      });

      // And forget that we ever marked anything
      setFauxSelection(null);
    }
  }, [fauxSelection, editorState, setEditorState]);
}

export function fauxStylesToCSS(styles, css) {
  const hasFauxSelection = styles.includes(FAUX_SELECTION);
  if (!hasFauxSelection) {
    return null;
  }
  const style = {
    backgroundColor: 'rgba(169, 169, 169, 0.7)',
  };
  if (css?.color) {
    style.color = `var(--faux-selection-color, ${css.color})`;
  }
  return style;
}
