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

/* Ignore reason: This is lifted from elsewhere - a combo of these basically:
 *
 * https://github.com/webdeveloperpr/draft-js-custom-styles/blob/f3e6b533905de8eee6da54f9727b5e5803d53fc4/src/index.js#L8-L52
 * https://github.com/facebook/draft-js/issues/602#issuecomment-584676405
 */
/* istanbul ignore next */
export function getAllStyleSetsInSelection(editorState) {
  const styleSets = [];
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  let key = selection.getStartKey();
  let startOffset = selection.getStartOffset();
  const endKey = selection.getEndKey();
  const endOffset = selection.getEndOffset();
  let hasMoreRounds = true;
  while (hasMoreRounds) {
    hasMoreRounds = key !== endKey;
    const block = contentState.getBlockForKey(key);
    const offsetEnd = hasMoreRounds ? block.getLength() : endOffset;
    const characterList = block.getCharacterList();
    for (
      let offsetIndex = startOffset;
      offsetIndex < offsetEnd;
      offsetIndex++
    ) {
      styleSets.push(characterList.get(offsetIndex).getStyle());
    }
    if (!hasMoreRounds) {
      break;
    }
    key = contentState.getKeyAfter(key);
    startOffset = 0;
  }

  return styleSets;
}
