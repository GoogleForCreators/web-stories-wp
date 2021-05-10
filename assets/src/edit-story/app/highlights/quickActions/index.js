/*
 * Copyright 2021 Google LLC
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
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { states, useHighlights } from '..';
import { useStory } from '../../story';

export const ELEMENT_TYPE = {
  SHAPE: 'shape',
  VIDEO: 'video',
};

/**
 * @return {Array} an array of quick action objects
 */
export const useQuickActions = () => {
  const { currentPage, selectedElements } = useStory(
    ({ state: { currentPage, selectedElements } }) => ({
      currentPage,
      selectedElements,
    })
  );

  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const changeBackgroundColor = useCallback(
    (elementId) => () => {
      setHighlights({ elementId, highlight: states.PAGE_BACKGROUND });
    },
    [setHighlights]
  );

  if (selectedElements.length > 1) {
    return [];
  }

  const backgroundElement =
    currentPage?.elements.find((element) => element.isBackground) ||
    selectedElements?.[0]?.isBackground;

  // Return the base state if:
  //  1. no element is selected
  //  2. the selected element is the background element
  if (
    (selectedElements.length === 0 && backgroundElement) ||
    selectedElements[0]?.isBackground
  ) {
    return [
      {
        label: 'page background',
        onClick: changeBackgroundColor(backgroundElement.id),
      },
    ];
  }

  switch (selectedElements?.[0]?.type) {
    case ELEMENT_TYPE.VIDEO:
      return [];
    default:
      return [];
  }
};
