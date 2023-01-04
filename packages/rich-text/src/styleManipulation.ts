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
import type { ContentState } from 'draft-js';
import { EditorState, Modifier } from 'draft-js';
import type { OrderedSet } from 'immutable';

/**
 * Internal dependencies
 */
import { NONE } from './customConstants';
import { getAllStyleSetsInSelection } from './draftUtils';
import type { SetStyleCallback, StyleGetter } from './types';

/**
 * Get a first style in the given set that match the given prefix,
 * or NONE if there's no match.
 *
 * @param styles  Set (ImmutableSet even) of styles to check
 * @param prefix  Prefix to test styles for
 * @return First match or NONE
 */
export function getPrefixStyleForCharacter(
  styles: OrderedSet<string>,
  prefix: string | typeof NONE
): string {
  const list = styles.toArray();
  const matcher = (style: string) => style && style.startsWith(prefix);
  if (!list.some(matcher)) {
    return NONE;
  }
  // If there are no matches, we return NONE, so the value is not `undefined` here, thus casting to `string`.
  return list.find(matcher) as string;
}

/**
 * Get a deduped list of all matching styles for every character in the
 * current selection for the current content.
 *
 * A style is matching, if it matches the current prefix. If for any given
 * character in the current selection, there's no prefix match, NONE will
 * be part of the returned set.
 *
 * If selection is collapsed, it'll get the style matching at the current
 * insertion point (or NONE).
 *
 * <example>
 * // In all examples below,
 * // - first character is WEIGHT-700, ITALIC
 * // - second character is WEIGHT-900, ITALIC
 * // - third character is ITALIC
 * // - all other characters have no styling
 *
 * // This is the text: Hello
 * // Editor state with selection "[He]llo":
 * const editorStateEl = {};
 * // Editor state with selection "[Hel]lo":
 * const editorStateHel = {};
 * // Editor state with selection "[Hello]":
 * const editorStateHello = {};
 * // Editor state with selection "Hel[lo]":
 * const editorStateLo = {};
 *
 * const styles = getPrefixStylesInSelection(editorStateEl, 'ITALIC');
 * // styles are now: ['ITALIC']
 *
 * const styles = getPrefixStylesInSelection(editorStateHello, 'ITALIC');
 * // styles are now: ['ITALIC', 'NONE']
 *
 * const styles = getPrefixStylesInSelection(editorStateLo, 'ITALIC');
 * // styles are now: ['NONE']
 *
 * const styles = getPrefixStylesInSelection(editorStateHel, 'WEIGHT');
 * // styles are now: ['WEIGHT-700', 'WEIGHT-900', 'NONE']
 *
 * const styles = getPrefixStylesInSelection(editorStateLo, 'WEIGHT');
 * // styles are now: ['NONE']
 * </example>
 *
 * @param editorState  Current editor state
 * @param prefix  Prefix to test styles for
 * @return Deduped array of all matching styles
 */
export function getPrefixStylesInSelection(
  editorState: EditorState,
  prefix: string
): string[] {
  const selection = editorState.getSelection();
  const styleSets = getAllStyleSetsInSelection(editorState);
  if (selection.isCollapsed() || styleSets.length === 0) {
    return [
      getPrefixStyleForCharacter(editorState.getCurrentInlineStyle(), prefix),
    ];
  }

  const styles = new Set<string>();
  styleSets.forEach((styleSet) =>
    styles.add(getPrefixStyleForCharacter(styleSet, prefix))
  );

  return [...styles];
}

function applyContent(editorState: EditorState, contentState: ContentState) {
  return EditorState.push(editorState, contentState, 'change-inline-style');
}

/**
 * Toggle prefix style in selection. This is a pretty complex function and
 * it's probably easiest to understand how it works by following the inline
 * comments and reading through the corresponding exhaustive unit tests.
 *
 * @param editorState  Current editor state
 * @param prefix  Style (prefix) to remove from state and potentially
 * replace with different style
 * @param shouldSetStyle  Optional function to get if new style
 * should be added or not
 * @param getStyleToSet  Optional function to get what new style
 * should be added
 * @return New editor state
 */
export function togglePrefixStyle(
  editorState: EditorState,
  prefix: string,
  shouldSetStyle: SetStyleCallback | null = null,
  getStyleToSet: StyleGetter | null = null
): EditorState {
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
    return EditorState.setInlineStyleOverride(editorState, inlineStyles);
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
  // If no function is given, we simply add the prefix as a style
  const styleToSet = getStyleToSet ? getStyleToSet(matchingStyles) : prefix;
  const newContentState = Modifier.applyInlineStyle(
    strippedContentState,
    editorState.getSelection(),
    styleToSet
  );

  return applyContent(editorState, newContentState);
}
