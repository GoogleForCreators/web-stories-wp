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
import {
  weightToStyle,
  styleToWeight,
  NONE,
  WEIGHT,
  ITALIC,
  UNDERLINE,
  SMALLEST_BOLD,
  DEFAULT_BOLD,
} from './customConstants';

function getPrefixStyleForCharacter(styles, prefix) {
  const list = styles.toArray().map((style) => style.style ?? style);
  if (!list.some((style) => style && style.startsWith(prefix))) {
    return NONE;
  }
  return list.find((style) => style.startsWith(prefix));
}

function getPrefixStylesInSelection(editorState, prefix) {
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

function togglePrefixStyle(
  editorState,
  prefix,
  shouldSetStyle = null,
  getStyleToSet = null
) {
  const matchingStyles = getPrefixStylesInSelection(editorState, prefix);

  // never the less, remove all old styles (except NONE, it's not actually a style)
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

// convert a set of weight styles to a set of weights
function getWeights(styles) {
  return styles.map((style) => (style === NONE ? 400 : styleToWeight(style)));
}

export function isBold(editorState) {
  const styles = getPrefixStylesInSelection(editorState, WEIGHT);
  const weights = getWeights(styles);
  const allIsBold = weights.every((w) => w >= SMALLEST_BOLD);
  return allIsBold;
}

export function toggleBold(editorState) {
  // if any character has weight less than SMALLEST_BOLD,
  // everything should be bolded
  const shouldSetBold = (styles) =>
    getWeights(styles).some((w) => w < SMALLEST_BOLD);

  // if setting a bold, it should be the boldest current weight,
  // though at least DEFAULT_BOLD
  const getBoldToSet = (styles) =>
    weightToStyle(
      Math.max.apply(null, [DEFAULT_BOLD].concat(getWeights(styles)))
    );

  return togglePrefixStyle(editorState, WEIGHT, shouldSetBold, getBoldToSet);
}

export function isItalic(editorState) {
  const styles = getPrefixStylesInSelection(editorState, ITALIC);
  return !styles.includes(NONE);
}

export function toggleItalic(editorState) {
  return togglePrefixStyle(editorState, ITALIC);
}

export function isUnderline(editorState) {
  const styles = getPrefixStylesInSelection(editorState, UNDERLINE);
  return !styles.includes(NONE);
}

export function getStateInfo(state) {
  return {
    isBold: isBold(state),
    isItalic: isItalic(state),
    isUnderline: isUnderline(state),
  };
}

export function toggleUnderline(editorState) {
  return togglePrefixStyle(editorState, UNDERLINE);
}
