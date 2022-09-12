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
import { Editor, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import type { EditorState } from 'draft-js';
import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useUnmount,
} from '@googleforcreators/react';
import type { ForwardedRef, KeyboardEvent } from 'react';

/**
 * Internal dependencies
 */
import useRichText from './useRichText';
import customInlineDisplay from './customInlineDisplay';
import type { State } from './types';

export interface RichTextEditorProps {
  content: string;
  onChange: (content: string | null) => void;
}

function RichTextEditor(
  { content, onChange }: RichTextEditorProps,
  ref: ForwardedRef<Partial<HTMLElement>>
) {
  const editorRef = useRef<Editor | null>(null);
  const {
    state: { editorState },
    actions: {
      setStateFromContent,
      updateEditorState,
      getHandleKeyCommand,
      getContentFromState,
      handlePastedText,
      clearState,
    },
  } = useRichText() as State;

  // Load state from parent when content changes
  useEffect(() => {
    setStateFromContent(content);
  }, [setStateFromContent, content]);

  // Push updates to parent when state changes
  useEffect(() => {
    if (!editorState) {
      return;
    }
    const newContent = getContentFromState(editorState);
    onChange(newContent);
  }, [onChange, getContentFromState, editorState]);

  const hasEditorState = Boolean(editorState);

  // On unmount, clear state in provider
  useUnmount(clearState);

  // Allow parent to focus editor and access main node
  useImperativeHandle(
    ref,
    () => ({
      focus: () => editorRef.current?.focus?.(),
      getNode: () => editorRef.current?.editorContainer,
    }),
    []
  );

  if (!hasEditorState) {
    return null;
  }

  const { hasCommandModifier } = KeyBindingUtil;

  function bindKeys(e: KeyboardEvent) {
    if (e.code === 'KeyA' && hasCommandModifier(e)) {
      return 'selectall';
    }
    return getDefaultKeyBinding(e);
  }

  // Handle basic key commands such as bold, italic and underscore.
  const handleKeyCommand = getHandleKeyCommand();
  return (
    <Editor
      ref={editorRef}
      onChange={updateEditorState}
      /* We return before if EditorState is null so we know it's not null here */
      editorState={editorState as EditorState}
      handleKeyCommand={handleKeyCommand}
      handlePastedText={handlePastedText}
      keyBindingFn={bindKeys}
      customStyleFn={customInlineDisplay}
      spellCheck
      stripPastedStyles
    />
  );
}

const RichTextEditorWithRef = forwardRef(RichTextEditor);

export default RichTextEditorWithRef;
