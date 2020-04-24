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
import { useCallback, useRef, useEffect } from 'react';
import { EditorState } from 'draft-js';

/**
 * Internal dependencies
 */
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  setFontWeight,
  setLetterSpacing,
} from './styleManipulation';

function useSelectionManipulation(editorState, setEditorState) {
  const lastKnownState = useRef(null);
  const lastKnownSelection = useRef(null);
  useEffect(() => {
    lastKnownState.current = editorState;
    if (!editorState) {
      lastKnownSelection.current = null;
    } else if (editorState.getSelection().hasFocus) {
      lastKnownSelection.current = editorState.getSelection();
    }
  }, [editorState]);

  const updateWhileUnfocused = useCallback(
    (updater, shouldForceFocus = true) => {
      const oldState = lastKnownState.current;
      const selection = lastKnownSelection.current;
      const workingState = shouldForceFocus
        ? EditorState.forceSelection(oldState, selection)
        : oldState;
      const newState = updater(workingState);
      setEditorState(newState);
    },
    [setEditorState]
  );

  const toggleBoldInSelection = useCallback(
    () => updateWhileUnfocused(toggleBold),
    [updateWhileUnfocused]
  );
  const setFontWeightInSelection = useCallback(
    (weight) => updateWhileUnfocused((s) => setFontWeight(s, weight)),
    [updateWhileUnfocused]
  );
  const toggleItalicInSelection = useCallback(
    () => updateWhileUnfocused(toggleItalic),
    [updateWhileUnfocused]
  );
  const toggleUnderlineInSelection = useCallback(
    () => updateWhileUnfocused(toggleUnderline),
    [updateWhileUnfocused]
  );
  const setLetterSpacingInSelection = useCallback(
    (ls) =>
      updateWhileUnfocused(
        (s) => setLetterSpacing(s, ls),
        /* shouldForceFocus */ false
      ),
    [updateWhileUnfocused]
  );

  return {
    toggleBoldInSelection,
    setFontWeightInSelection,
    toggleItalicInSelection,
    toggleUnderlineInSelection,
    setLetterSpacingInSelection,
  };
}

export default useSelectionManipulation;
