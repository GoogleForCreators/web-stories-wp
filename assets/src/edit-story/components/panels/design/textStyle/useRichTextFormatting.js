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
import { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Internal dependencies
 */
import isPatternEqual from '../../../../utils/isPatternEqual';
import useRichText from '../../../richText/useRichText';
import {
  getHTMLFormatters,
  getHTMLInfo,
} from '../../../richText/htmlManipulation';
import { MULTIPLE_VALUE } from '../../../../constants';
import { useGlobalKeyDownEffect } from '../../../../../design-system';
import { useCanvas } from '../../../../app';

/**
 * Equality function for *primitives and color patterns* only.
 *
 * @param {any} a  First value to compare
 * @param {any} b  Second value to compare
 * @return {boolean} True if equal
 */
function isEqual(a, b) {
  // patterns are truthy objects with either a type or a color attribute.
  // Note: `null` is a falsy object, that would cause an error if first
  // check is removed.
  const isAPattern = a && typeof a === 'object' && (a.type || a.color);
  const isBPattern = b && typeof b === 'object' && (b.type || b.color);

  return isAPattern && isBPattern ? isPatternEqual(a, b) : a === b;
}

/**
 * A function to gather the text info for multiple elements into a single
 * one.
 *
 * The text info object contains a number of values that can be either
 * primitives or a color object.
 *
 * If any two objects for the same key have different values, return
 * `MULTIPLE_VALUE`. Uses `isEqual` to determine this equality.`
 *
 * @param {Object} reduced  Currently reduced object from previous elements
 * - will be empty for first object
 * @param {Object} info  Info about current object
 * @return {Object} Combination of object as described.
 */
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

  const { clearEditing } = useCanvas(({ actions: { clearEditing } }) => ({
    clearEditing,
  }));

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

  const queuedPushRef = useRef(null);
  const queuePush = useCallback(
    (...args) => {
      queuedPushRef.current = args;
    },
    [queuedPushRef]
  );

  // when selected elements update, run any queued pushes
  useEffect(() => {
    const pushArgs = queuedPushRef.current;
    if (pushArgs) {
      push(...pushArgs);
      queuedPushRef.current = null;
    }
  }, [selectedElements, queuedPushRef, push]);

  const handlers = useMemo(() => {
    const htmlFormatters = getHTMLFormatters();

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
        // when editing, resetting font weight needs to save before resetting
        handleResetFontWeight: async (weight) => {
          // clear editing to save any pending updates
          await clearEditing();
          // queue push until selectedElements are saved and content is updated
          queuePush(htmlFormatters.setFontWeight, weight);
        },
      };
    }

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
      handleResetFontWeight: (weight) =>
        push(htmlFormatters.setFontWeight, weight),
    };
  }, [hasCurrentEditor, selectionActions, push, clearEditing, queuePush]);

  useGlobalKeyDownEffect(
    { key: ['mod+b', 'mod+u', 'mod+i'] },
    ({ key }) => {
      switch (key) {
        case 'b':
          handlers.handleClickBold();
          break;
        case 'i':
          handlers.handleClickItalic();
          break;
        case 'u':
          handlers.handleClickUnderline();
          break;
        default:
          break;
      }
    },
    [handlers]
  );

  return {
    textInfo,
    handlers,
  };
}

export default useRichTextFormatting;
