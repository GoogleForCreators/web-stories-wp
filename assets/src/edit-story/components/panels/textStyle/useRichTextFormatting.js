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
import useRichText from '../../richText/useRichText';
import {
  getHTMLInfo,
  toggleBoldInHTML,
  setFontWeightInHTML,
  toggleItalicInHTML,
  toggleUnderlineInHTML,
  setLetterSpacingInHTML,
} from '../../richText/htmlManipulation';
import { MULTIPLE_VALUE } from '../../form';

function reduceWithMultiple(reduced, info) {
  return Object.fromEntries(
    Object.keys(info).map((key) => {
      const wasMultiple = reduced[key] === MULTIPLE_VALUE;
      const hadValue = typeof reduced[key] !== 'undefined';
      const areDifferent = hadValue && reduced[key] !== info[key];
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
    actions: {
      selectionActions: {
        toggleBoldInSelection,
        setFontWeightInSelection,
        toggleItalicInSelection,
        toggleUnderlineInSelection,
        setLetterSpacingInSelection,
      },
    },
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
        handleClickBold: toggleBoldInSelection,
        handleSelectFontWeight: setFontWeightInSelection,
        handleClickItalic: toggleItalicInSelection,
        handleClickUnderline: toggleUnderlineInSelection,
        handleSetLetterSpacing: setLetterSpacingInSelection,
      };
    }

    return {
      handleClickBold: (flag) => push(toggleBoldInHTML, flag),
      handleSelectFontWeight: (weight) => push(setFontWeightInHTML, weight),
      handleClickItalic: (flag) => push(toggleItalicInHTML, flag),
      handleClickUnderline: (flag) => push(toggleUnderlineInHTML, flag),
      handleSetLetterSpacing: (ls) => push(setLetterSpacingInHTML, ls),
    };
  }, [
    hasCurrentEditor,
    toggleBoldInSelection,
    setFontWeightInSelection,
    toggleItalicInSelection,
    toggleUnderlineInSelection,
    setLetterSpacingInSelection,
    push,
  ]);

  return {
    textInfo,
    handlers,
  };
}

export default useRichTextFormatting;
