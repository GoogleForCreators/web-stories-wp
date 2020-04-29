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
import { Modifier, EditorState } from 'draft-js';

/**
 * Internal dependencies
 */
import { NONE } from './customConstants';

export function getPrefixStyleForCharacter(styles, prefix) {
  const list = styles.toArray().map((style) => style.style ?? style);
  if (!list.some((style) => style && style.startsWith(prefix))) {
    return NONE;
  }
  return list.find((style) => style.startsWith(prefix));
}

export function getPrefixStylesInSelection(editorState, prefix) {
  const selection = editorState.getSelection();
  const styles = new Set();
  if (selection.isCollapsed()) {
    styles.add(
      getPrefixStyleForCharacter(editorState.getCurrentInlineStyle(), prefix)
    );
    return [...styles];
  }

  const contentState = editorState.getCurrentContent();
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
      styles.add(
        getPrefixStyleForCharacter(
          characterList.get(offsetIndex).getStyle(),
          prefix
        )
      );
    }
    if (!hasMoreRounds) {
      break;
    }
    key = contentState.getKeyAfter(key);
    startOffset = 0;
  }

  return [...styles];
}

function applyContent(editorState, contentState) {
  return EditorState.push(editorState, contentState, 'change-inline-style');
}

export function togglePrefixStyle(
  editorState,
  prefix,
  shouldSetStyle = null,
  getStyleToSet = null
) {
  if (editorState.getSelection().isCollapsed()) {
    // A different set of rules apply here
    // First find all styles that apply at cursor - we'll reapply those as override
    // with modifications at the end
    let inlineStyles = editorState.getCurrentInlineStyle();

    // See if there's a matching style for our prefix
    const foundMatch = getPrefixStyleForCharacter(inlineStyles, prefix);

    // Then remove potentially found style from list
    if (foundMatch !== NONE) {
      inlineStyles = inlineStyles.remove(foundMatch);
    }

    // Then figure out whether to apply new style or not
    const willAddStyle = shouldSetStyle
      ? shouldSetStyle([foundMatch])
      : foundMatch === NONE;

    // If so, add to list
    if (willAddStyle) {
      const styleToAdd = getStyleToSet ? getStyleToSet([foundMatch]) : prefix;
      inlineStyles = inlineStyles.add(styleToAdd);
    }

    // Finally apply to style override
    const newState = EditorState.setInlineStyleOverride(
      editorState,
      inlineStyles
    );
    return newState;
  }

  const matchingStyles = getPrefixStylesInSelection(editorState, prefix);

  // First remove all old styles matching prefix
  // (except NONE, it's not actually a style)
  const stylesToRemove = matchingStyles.filter((s) => s !== NONE);
  const strippedContentState = stylesToRemove.reduce(
    (contentState, styleToRemove) =>
      Modifier.removeInlineStyle(
        contentState,
        editorState.getSelection(),
        styleToRemove
      ),
    editorState.getCurrentContent()
  );

  // Should we add a style to everything now?
  // If no function is given, we simply add the style if any
  // character did not have a match (NONE is in the list)
  const willSetStyle = shouldSetStyle
    ? shouldSetStyle(matchingStyles)
    : matchingStyles.includes(NONE);

  if (!willSetStyle) {
    // we're done!
    return applyContent(editorState, strippedContentState);
  }

  // Add style to entire selection
  // If no function is given, we simple add the prefix as a style
  const styleToSet = getStyleToSet ? getStyleToSet(matchingStyles) : prefix;
  const newContentState = Modifier.applyInlineStyle(
    strippedContentState,
    editorState.getSelection(),
    styleToSet
  );

  return applyContent(editorState, newContentState);
}
