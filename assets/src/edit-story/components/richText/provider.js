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
import { useState, useCallback, useMemo } from 'react';
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
import getStateInfo from './getStateInfo';
import { useFauxSelection } from './fauxSelection';
import customImport from './customImport';
import customExport from './customExport';
import useSelectionManipulation from './useSelectionManipulation';

function RichTextProvider({ children }) {
  const { editingElementState } = useCanvas((state) => ({
    editingElementState: state.state.editingElementState,
  }));

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

  useFauxSelection(editorState, setEditorState);

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
  }, [setEditorState]);

  const hasCurrentEditor = Boolean(editorState);

  const selectionActions = useSelectionManipulation(
    editorState,
    setEditorState
  );

  const value = {
    state: {
      editorState,
      hasCurrentEditor,
      selectionInfo,
    },
    actions: {
      setStateFromContent,
      updateEditorState,
      getHandleKeyCommand,
      clearState,
      selectionActions,
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
  children: PropTypes.node.isRequired,
};

export default RichTextProvider;
