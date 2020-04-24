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
import PropTypes from 'prop-types';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { EditorState } from 'draft-js';

/**
 * Internal dependencies
 */
import useCanvas from '../canvas/useCanvas';
import RichTextContext from './context';
import {
  getSelectionForAll,
  getSelectionForOffset,
  getFilteredState,
  getHandleKeyCommandFromState,
} from './util';
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  setFontWeight,
  getStateInfo,
} from './styleManipulation';
import customImport from './customImport';
import customExport from './customExport';

function RichTextProvider({ children }) {
  const {
    state: { editingElementState },
  } = useCanvas();

  const [forceFocus, setForceFocus] = useState(false);
  const [editorState, setEditorState] = useState(null);

  const selectionInfo = useMemo(() => {
    if (editorState) {
      return getStateInfo(editorState);
    }
    return { isBold: false, isItalic: false, isUnderline: false };
  }, [editorState]);

  const setStateFromContent = useCallback(
    (content) => {
      const { offset, clearContent, selectAll } = editingElementState || {};
      let state = EditorState.createWithContent(customImport(content));
      if (clearContent) {
        // If `clearContent` is specified, push the update to clear content so that
        // it can be undone.
        state = EditorState.push(state, customImport(''), 'remove-range');
      }
      let selection;
      if (selectAll) {
        selection = getSelectionForAll(state.getCurrentContent());
      } else if (offset) {
        selection = getSelectionForOffset(state.getCurrentContent(), offset);
      }
      if (selection) {
        state = EditorState.forceSelection(state, selection);
      }
      setEditorState(state);
    },
    [editingElementState, setEditorState]
  );

  const lastKnownState = useRef(null);
  const lastKnownSelection = useRef(null);
  useEffect(() => {
    lastKnownState.current = editorState;
    if (editorState?.getSelection()?.hasFocus) {
      lastKnownSelection.current = editorState.getSelection();
    }
  }, [editorState]);

  // This filters out illegal content (see `getFilteredState`)
  // on paste and updates state accordingly.
  // Furthermore it also sets initial selection if relevant.
  const updateEditorState = useCallback(
    (newEditorState) => {
      const filteredState = getFilteredState(newEditorState, editorState);
      setEditorState(filteredState);
    },
    [editorState, setEditorState]
  );

  const getHandleKeyCommand = useCallback(
    () => getHandleKeyCommandFromState(updateEditorState),
    [updateEditorState]
  );

  const clearState = useCallback(() => {
    setEditorState(null);
    lastKnownSelection.current = null;
  }, [setEditorState]);

  const hasCurrentEditor = Boolean(editorState);

  const updateWhileUnfocused = useCallback((updater, ...args) => {
    const oldState = lastKnownState.current;
    const selection = lastKnownSelection.current;
    const workingState = EditorState.forceSelection(oldState, selection);
    const newState = updater(workingState, ...args);
    setEditorState(newState);
    setForceFocus(true);
  }, []);

  const toggleBoldInSelection = useCallback(
    () => updateWhileUnfocused(toggleBold),
    [updateWhileUnfocused]
  );
  const setFontWeightInSelection = useCallback(
    (weight) => updateWhileUnfocused(setFontWeight, weight),
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

  const clearForceFocus = useCallback(() => setForceFocus(false), []);

  const value = {
    state: {
      editorState,
      hasCurrentEditor,
      selectionInfo,
      forceFocus,
    },
    actions: {
      setStateFromContent,
      updateEditorState,
      getHandleKeyCommand,
      clearState,
      clearForceFocus,
      toggleBoldInSelection,
      setFontWeightInSelection,
      toggleItalicInSelection,
      toggleUnderlineInSelection,
      // These actually don't work on the state at all, just pure functions
      getContentFromState: customExport,
    },
  };

  return (
    <RichTextContext.Provider value={value}>
      {children}
    </RichTextContext.Provider>
  );
}

RichTextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default RichTextProvider;
