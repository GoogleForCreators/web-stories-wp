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
import {
  useState,
  useCallback,
  useMemo,
  useRef,
} from '@googleforcreators/react';
import { EditorState } from 'draft-js';

/**
 * Internal dependencies
 */
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
import useHandlePastedText from './useHandlePastedText';
import useSelectionManipulation from './useSelectionManipulation';

const INITIAL_SELECTION_INFO = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isUppercase: false,
};

function RichTextProvider({ children, editingState }) {
  const [editorState, setEditorState] = useState(null);
  const lastKnownStyle = useRef(null);

  const selectionInfo = useMemo(() => {
    if (editorState) {
      return getStateInfo(editorState);
    }
    return INITIAL_SELECTION_INFO;
  }, [editorState]);

  const setStateFromContent = useCallback(
    (content) => {
      const { offset, clearContent, selectAll } = editingState || {};
      let state = EditorState.createWithContent(customImport(content));
      if (clearContent) {
        // If `clearContent` is specified, push the update to clear content so that
        // it can be undone.
        state = EditorState.push(state, customImport(''), 'remove-range');
      }
      let selection;
      if (selectAll) {
        selection = getSelectionForAll(state.getCurrentContent());
      } else if (!isNaN(offset)) {
        selection = getSelectionForOffset(state.getCurrentContent(), offset);
      }
      if (selection) {
        state = EditorState.forceSelection(state, selection);
      }
      lastKnownStyle.current = state.getCurrentInlineStyle();
      setEditorState(state);
    },
    [editingState, setEditorState]
  );

  useFauxSelection(editorState, setEditorState);

  // This filters out illegal content (see `getFilteredState`)
  // on paste and updates state accordingly.
  // Furthermore it also sets initial selection if relevant.
  const updateEditorState = useCallback(
    (newEditorState) => {
      let filteredState = getFilteredState(newEditorState, editorState);
      const isEmpty = filteredState.getCurrentContent().getPlainText('') === '';
      if (isEmpty) {
        // Copy last known current style as inline style
        filteredState = EditorState.setInlineStyleOverride(
          filteredState,
          lastKnownStyle.current
        );
      } else {
        lastKnownStyle.current = filteredState.getCurrentInlineStyle();
      }
      setEditorState(filteredState);
    },
    [editorState, setEditorState]
  );

  const getHandleKeyCommand = useCallback(
    () => getHandleKeyCommandFromState(updateEditorState),
    [updateEditorState]
  );

  const handlePastedText = useHandlePastedText(setEditorState);

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
      handlePastedText,
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
  editingState: PropTypes.object,
};

export default RichTextProvider;
