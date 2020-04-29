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

/**
 * @param {Object} element Text element properties.
 * @param {function(number):any} dataToStyleX Converts a x-unit to CSS.
 * @param {function(number):any} dataToStyleY Converts a y-unit to CSS.
 * @param {function(number):any} dataToFontSizeY Converts a font-size metric to
 * y-unit CSS.
 * @return {Object} The map of text style properties and values.
 */
export function generateParagraphTextStyle(
  element,
  dataToStyleX,
  dataToStyleY,
  dataToFontSizeY = dataToStyleY
) {
  const {
    font,
    fontSize,
    fontStyle,
    fontWeight,
    lineHeight,
    letterSpacing,
    padding,
    textAlign,
    textDecoration,
  } = element;
  return {
    whiteSpace: 'pre-wrap',
    margin: 0,
    fontFamily: generateFontFamily(font),
    fontSize: dataToFontSizeY(fontSize),
    fontStyle,
    fontWeight,
    lineHeight,
    letterSpacing: `${typeof letterSpacing === 'number' ? letterSpacing : 0}em`,
    textAlign,
    textDecoration,
    padding: `${dataToStyleY(padding?.vertical || 0)}px ${dataToStyleX(
      padding?.horizontal || 0
    )}px`,
  };
}

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
        focusKey: block.getKey(),
        focusOffset: countdown,
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

export const generateFontFamily = ({ family, fallbacks }) => {
  const genericFamilyKeywords = [
    'cursive',
    'fantasy',
    'monospace',
    'serif',
    'sans-serif',
  ];
  // Wrap into " since some fonts won't work without it.
  let fontFamilyDisplay = family ? `"${family}"` : null;
  if (fallbacks && fallbacks.length) {
    fontFamilyDisplay += family ? `,` : ``;
    fontFamilyDisplay += fallbacks
      .map((fallback) =>
        genericFamilyKeywords.includes(fallback) ? fallback : `"${fallback}"`
      )
      .join(`,`);
  }
  return fontFamilyDisplay;
};

let contentBuffer = null;
export const draftMarkupToContent = (content, bold) => {
  // @todo This logic is temporary and will change with selecting part + marking bold/italic/underline.
  if (bold) {
    content = `<strong>${content}</strong>`;
  }
  if (!contentBuffer) {
    contentBuffer = document.createElement('template');
  }
  // Ensures the content is valid HTML.
  contentBuffer.innerHTML = content;
  return contentBuffer.innerHTML;
};

export const getHighlightLineheight = function (
  lineHeight,
  verticalPadding,
  unit = 'px'
) {
  return `calc(
    ${lineHeight}em
    ${verticalPadding > 0 ? '+' : '-'}
    ${2 * Math.abs(verticalPadding)}${unit}
  )`;
};
