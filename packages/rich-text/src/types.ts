/*
 * Copyright 2022 Google LLC
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
import type { Pattern } from '@googleforcreators/patterns';
import type { EditorState } from 'draft-js';

export type AllowedSetterArgs = undefined | boolean | Pattern | number;

export type StyleSetter = (
  state: EditorState | null,
  arg: AllowedSetterArgs
) => EditorState;

export type SetStyleCallback = (styles: string[]) => unknown;
export type StyleGetter = (styles: string[]) => string;

export interface SelectionInfo {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isUppercase: boolean;
}

// Partial to make the props optional.
export interface StateInfo extends Partial<SelectionInfo> {
  color?: Pattern;
  letterSpacing?: number;
  fontWeight?: number;
}

export interface State {
  state: {
    editorState: EditorState | null;
    hasCurrentEditor: boolean;
    selectionInfo: StateInfo | undefined;
  };
  actions: {
    setStateFromContent: (content: string) => void;
    updateEditorState: (state: EditorState) => void;
    getHandleKeyCommand: () => (
      command: string,
      currentEditorState: EditorState
    ) => 'handled' | 'not-handled';
    handlePastedText: (
      text: string,
      html: string,
      state: EditorState
    ) => 'handled' | 'not-handled';
    clearState: () => void;
    selectionActions: Record<string, StyleSetter>;
    getContentFromState: (editorState: EditorState) => string | null;
  };
}
