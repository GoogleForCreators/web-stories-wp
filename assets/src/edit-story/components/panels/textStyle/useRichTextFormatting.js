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
import { useMemo, useCallback } from 'react';

/**
 * Internal dependencies
 */
import generatePatternStyles from '../../../utils/generatePatternStyles';
import useRichText from '../../richText/useRichText';
import {
  getHTMLFormatters,
  getHTMLInfo,
} from '../../richText/htmlManipulation';
import { MULTIPLE_VALUE } from '../../form';

function isEqual(a, b) {
  const isPattern = typeof a === 'object' && (a.type || a.color);
  if (!isPattern) {
    return a === b;
  }

  const aStyle = generatePatternStyles(a);
  const bStyle = generatePatternStyles(b);
  const keys = Object.keys(aStyle);
  return keys.every((key) => aStyle[key] === bStyle[key]);
}

function reduceWithMultiple(reduced, info) {
  return Object.fromEntries(
    Object.keys(info).map((key) => {
      const wasMultiple = reduced[key] === MULTIPLE_VALUE;
      const hadValue = typeof reduced[key] !== 'undefined';
      const areDifferent = hadValue && !isEqual(reduced[key], info[key]);
      if (wasMultiple || areDifferent) {
        return [key, MULTIPLE_VALUE];
      }
      return [key, info[key]];
    })
  );
}

function useRichTextFormatting(selectedElements, pushUpdate) {
  const {
    state: { hasCurrentEditor, selectionInfo },
    actions: { selectionActions },
  } = useRichText();

  const textInfo = useMemo(() => {
    if (hasCurrentEditor) {
      return selectionInfo;
    }

    // loop over all elements, find info for content and reduce to common value
    // (setting MULTIPLE_VALUE appropriately)
    return selectedElements
      .map(({ content }) => content)
      .map(getHTMLInfo)
      .reduce(reduceWithMultiple, {});
  }, [hasCurrentEditor, selectionInfo, selectedElements]);

  const push = useCallback(
    (updater, ...args) =>
      pushUpdate(
        ({ content }) => ({ content: updater(content, ...args) }),
        true
      ),
    [pushUpdate]
  );

  const handlers = useMemo(() => {
    if (hasCurrentEditor) {
      return {
        // This particular function ignores the flag argument.
        // Bold for inline selection has its own logic for
        // determining proper resulting bold weight
        handleClickBold: () => selectionActions.toggleBoldInSelection(),
        // All these keep their arguments:
        handleSelectFontWeight: selectionActions.setFontWeightInSelection,
        handleClickItalic: selectionActions.toggleItalicInSelection,
        handleClickUnderline: selectionActions.toggleUnderlineInSelection,
        handleSetLetterSpacing: selectionActions.setLetterSpacingInSelection,
        handleSetColor: selectionActions.setColorInSelection,
      };
    }

    const htmlFormatters = getHTMLFormatters();

    return {
      handleClickBold: (flag) => push(htmlFormatters.toggleBold, flag),
      handleSelectFontWeight: (weight) =>
        push(htmlFormatters.setFontWeight, weight),
      handleClickItalic: (flag) => push(htmlFormatters.toggleItalic, flag),
      handleClickUnderline: (flag) =>
        push(htmlFormatters.toggleUnderline, flag),
      handleSetLetterSpacing: (letterSpacing) =>
        push(htmlFormatters.setLetterSpacing, letterSpacing),
      handleSetColor: (color) => push(htmlFormatters.setColor, color),
    };
  }, [hasCurrentEditor, selectionActions, push]);

  return {
    textInfo,
    handlers,
  };
}

export default useRichTextFormatting;
