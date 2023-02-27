/*
 * Copyright 2022 Google LLC
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
import { forwardRef, useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { stripHTML } from '@googleforcreators/dom';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useFont, useStory } from '../../app';
import getUpdatedSizeAndPosition from '../../utils/getUpdatedSizeAndPosition';
import useRichTextFormatting from '../panels/design/textStyle/useRichTextFormatting';
import getClosestFontWeight from '../panels/design/textStyle/getClosestFontWeight';
import { getCommonValue } from '../panels/shared';
import FontPicker from '../fontPicker';
import updateProperties from '../style/updateProperties';

const StoryFontPicker = forwardRef(function StoryFontPicker(
  { selectedElements, ...rest },
  ref
) {
  const { updateElementsById } = useStory(({ actions }) => ({
    updateElementsById: actions.updateElementsById,
  }));

  const selectedElementIds = selectedElements.map(({ id }) => id);

  const pushUpdate = useCallback(
    (update, commitValues) => {
      updateElementsById({
        elementIds: selectedElementIds,
        properties: (element) => {
          const updates = updateProperties(element, update, commitValues);
          const sizeUpdates = getUpdatedSizeAndPosition({
            ...element,
            ...updates,
          });
          return {
            ...updates,
            ...sizeUpdates,
          };
        },
      });
    },
    [updateElementsById, selectedElementIds]
  );

  const {
    textInfo: { fontWeight, isItalic },
    handlers: { handleResetFontWeight },
  } = useRichTextFormatting(selectedElements, pushUpdate);

  const { addRecentFont, maybeEnqueueFontStyle } = useFont(({ actions }) => ({
    addRecentFont: actions.addRecentFont,
    maybeEnqueueFontStyle: actions.maybeEnqueueFontStyle,
  }));

  const fontFamily = getCommonValue(
    selectedElements,
    ({ font }) => font?.family
  );

  const fontStyle = isItalic ? 'italic' : 'normal';

  const onChange = useCallback(
    async (newFont) => {
      const { id, name, value, ...newFontFormatted } = newFont;
      void trackEvent('font_family_changed', { name });

      await maybeEnqueueFontStyle(
        selectedElements.map(({ content }) => {
          return {
            font: newFontFormatted,
            fontStyle,
            fontWeight,
            content: stripHTML(content),
          };
        })
      );
      addRecentFont(newFont);
      pushUpdate({ font: newFontFormatted }, true);

      const newFontWeight = getClosestFontWeight(400, newFontFormatted.weights);
      await handleResetFontWeight(newFontWeight);
    },
    [
      addRecentFont,
      fontStyle,
      fontWeight,
      maybeEnqueueFontStyle,
      pushUpdate,
      selectedElements,
      handleResetFontWeight,
    ]
  );

  return (
    <FontPicker
      onChange={onChange}
      currentValue={fontFamily}
      {...rest}
      ref={ref}
    />
  );
});

StoryFontPicker.propTypes = {
  highlightStylesOverride: PropTypes.array,
};

export default StoryFontPicker;
