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
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import useRichTextFormatting from '../../textStyle/useRichTextFormatting';
import { useStory } from '../../../../../app/story';
import { areAllType } from '../utils';

function useApplyColor({ pushUpdate }) {
  const {
    currentPage,
    selectedElementIds,
    selectedElements,
    updateElementsById,
    updateCurrentPageProperties,
  } = useStory(
    ({
      state: { selectedElementIds, selectedElements, currentPage },
      actions: { updateElementsById, updateCurrentPageProperties },
    }) => {
      return {
        currentPage,
        selectedElementIds,
        selectedElements,
        updateElementsById,
        updateCurrentPageProperties,
      };
    }
  );

  const isText = areAllType('text', selectedElements);
  const isBackground = selectedElements[0].id === currentPage.elements[0].id;

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
    handlers: { handleSetColor },
  } = useRichTextFormatting(selectedElements, push);

  const handleApplyColor = useCallback(
    (color) => {
      if (isText) {
        handleSetColor(color);
      } else if (isBackground) {
        updateCurrentPageProperties({
          properties: { backgroundColor: color },
        });
      } else {
        updateElementsById({
          elementIds: selectedElementIds,
          properties: { backgroundColor: color },
        });
      }
    },
    [
      isBackground,
      updateCurrentPageProperties,
      isText,
      handleSetColor,
      selectedElementIds,
      updateElementsById,
    ]
  );
  return handleApplyColor;
}

export default useApplyColor;
