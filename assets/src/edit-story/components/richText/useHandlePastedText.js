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

function useHandlePastedText(setEditorState) {
  return useCallback(
    (text, html, state) => {
      // TODO: handle pasted html content
      // https://github.com/google/web-stories-wp/issues/760
      const content = state.getCurrentContent();
      const selection = state.getSelection();
      const style = state.getCurrentInlineStyle();
      const newState = Modifier.replaceText(content, selection, text, style);
      const result = EditorState.push(state, newState, 'insert-characters');
      setEditorState(result);
      return true;
    },
    [setEditorState]
  );
}

export default useHandlePastedText;
