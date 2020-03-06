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
import { RichUtils, SelectionState } from 'draft-js';
import { filterEditorState } from 'draftjs-filters';

export function getSelectionForAll(content) {
  const firstBlock = content.getFirstBlock();
  const lastBlock = content.getLastBlock();
  return new SelectionState({
    anchorKey: firstBlock.getKey(),
    anchorOffset: 0,
    focusKey: lastBlock.getKey(),
    focusOffset: lastBlock.getLength(),
  });
}

export function getSelectionForOffset(content, offset) {
  const blocks = content.getBlocksAsArray();
  let countdown = offset;
  for (let i = 0; i < blocks.length && countdown >= 0; i++) {
    const block = blocks[i];
    const length = block.getLength();
    if (countdown <= length) {
      const selection = new SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: countdown,
      });
      return selection;
    }
    // +1 char for the delimiter.
    countdown -= length + 1;
  }
  return null;
}

export function getFilteredState(editorState, oldEditorState) {
  const shouldFilterPaste =
    oldEditorState.getCurrentContent() !== editorState.getCurrentContent() &&
    editorState.getLastChangeType() === 'insert-fragment';

  if (!shouldFilterPaste) {
    return editorState;
  }

  return filterEditorState(
    {
      blocks: [],
      styles: ['BOLD', 'ITALIC', 'UNDERLINE'],
      entities: [],
      maxNesting: 1,
      whitespacedCharacters: [],
    },
    editorState
  );
}

const ALLOWED_KEY_COMMANDS = ['bold', 'italic', 'underline'];
export const getHandleKeyCommand = (setEditorState) => (
  command,
  currentEditorState
) => {
  if (!ALLOWED_KEY_COMMANDS.includes(command)) {
    return 'not-handled';
  }
  const newEditorState = RichUtils.handleKeyCommand(
    currentEditorState,
    command
  );
  if (newEditorState) {
    setEditorState(newEditorState);
    return 'handled';
  }
  return 'not-handled';
};

export const generateFontFamily = (fontFamily, fontFallback) => {
  let fontFamilyDisplay = fontFamily ? `${fontFamily}` : null;
  if (fontFallback && fontFallback.length) {
    fontFamilyDisplay += fontFamily ? `,` : ``;
    fontFamilyDisplay += `${fontFallback.join(`,`)}`;
  }
  return fontFamilyDisplay;
};
