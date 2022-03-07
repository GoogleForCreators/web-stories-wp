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
import { useCallback, useRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useRichTextFormatting from '../panels/design/textStyle/useRichTextFormatting';
import { useStory } from '../../app';
import { usePresubmitHandler } from '../form';
import getUpdatedSizeAndPosition from '../../utils/getUpdatedSizeAndPosition';
import { STABLE_ARRAY } from '../../constants';

function useApplyStyle({ pushUpdate }) {
  // Update size and position if relevant values have changed.
  usePresubmitHandler(getUpdatedSizeAndPosition, []);

  const selectedTextElements = useStory(({ state: { selectedElements } }) => {
    return selectedElements
      ? selectedElements?.filter(({ type }) => type === 'text')
      : STABLE_ARRAY;
  });

  const extraPropsToAdd = useRef(null);
  const push = useCallback(
    (updater) => {
      pushUpdate((oldProps) => {
        return {
          ...updater(oldProps),
          ...extraPropsToAdd.current,
        };
      }, true);
      extraPropsToAdd.current = null;
    },
    [pushUpdate]
  );

  const {
    handlers: {
      handleSetColor,
      handleSetLetterSpacing,
      handleClickUnderline,
      handleClickItalic,
      handleSelectFontWeight,
    },
  } = useRichTextFormatting(selectedTextElements, push);

  const handleApplyStyle = useCallback(
    (preset) => {
      const {
        color,
        fontWeight,
        isItalic,
        isUnderline,
        letterSpacing,
        ...rest
      } = preset;
      extraPropsToAdd.current = rest;
      handleSetColor(color);
      handleSetLetterSpacing(letterSpacing);
      handleSelectFontWeight(fontWeight);
      handleClickUnderline(isUnderline);
      handleClickItalic(isItalic);
    },
    [
      handleSetColor,
      handleSetLetterSpacing,
      handleClickUnderline,
      handleClickItalic,
      handleSelectFontWeight,
    ]
  );
  return handleApplyStyle;
}

export default useApplyStyle;
