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
import { Editor } from 'draft-js';
import PropTypes from 'prop-types';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

/**
 * Internal dependencies
 */
import useUnmount from '../../utils/useUnmount';
import useRichText from './useRichText';
import customInlineDisplay from './customInlineDisplay';

function RichTextEditor({ content, onChange }, ref) {
  const editorRef = useRef(null);
  const {
    state: { editorState, forceFocus },
    actions: {
      setStateFromContent,
      updateEditorState,
      getHandleKeyCommand,
      getContentFromState,
      clearState,
      clearForceFocus,
    },
  } = useRichText();

  // Load state from parent when content changes
  useEffect(() => {
    setStateFromContent(content);
  }, [setStateFromContent, content]);

  // Push updates to parent when state changes
  useEffect(() => {
    const newContent = getContentFromState(editorState);
    if (newContent) {
      onChange(newContent);
    }
  }, [onChange, getContentFromState, editorState]);

  // Set focus when initially rendered.
  useLayoutEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  // Set focus when forced to, then clear
  useLayoutEffect(() => {
    if (editorRef.current && forceFocus) {
      editorRef.current.focus();
      clearForceFocus();
    }
  }, [forceFocus, clearForceFocus]);

  const hasEditorState = Boolean(editorState);

  // On unmount, clear state in provider
  useUnmount(clearState);

  // Allow parent to focus editor and access main node
  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus?.(),
    getNode: () => editorRef.current?.editorContainer,
  }));

  if (!hasEditorState) {
    return null;
  }

  // Handle basic key commands such as bold, italic and underscore.
  const handleKeyCommand = getHandleKeyCommand();

  return (
    <Editor
      ref={editorRef}
      onChange={updateEditorState}
      editorState={editorState}
      handleKeyCommand={handleKeyCommand}
      customStyleFn={customInlineDisplay}
    />
  );
}

const RichTextEditorWithRef = forwardRef(RichTextEditor);

RichTextEditor.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RichTextEditorWithRef;
