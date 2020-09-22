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
 * Internal dependencies
 */
import { useStory } from '../../app';
import useBatchingCallback from '../../utils/useBatchingCallback';

function useAddPastedElements() {
  const {
    currentPage,
    addElements,
    updateCurrentPageProperties,
    deleteElementById,
    combineElements,
  } = useStory(
    ({
      state: { currentPage, selectedElements },
      actions: {
        addElements,
        deleteSelectedElements,
        updateCurrentPageProperties,
        deleteElementById,
        combineElements,
      },
    }) => {
      return {
        currentPage,
        selectedElements,
        addElements,
        deleteSelectedElements,
        updateCurrentPageProperties,
        deleteElementById,
        combineElements,
      };
    }
  );

  const addPastedElements = useBatchingCallback(
    (elements) => {
      if (elements.length === 0) {
        return false;
      }

      // If a bg element is pasted, handle that first
      const newBackgroundElement = elements.find(
        ({ isBackground }) => isBackground
      );
      if (newBackgroundElement) {
        const existingBgElement = currentPage.elements[0];
        if (newBackgroundElement.isDefaultBackground) {
          // The user has pasted a non-media background from another page:
          // Delete existing background (if any) and then update page
          // with this default element background color
          if (!existingBgElement.isDefaultBackground) {
            deleteElementById({ elementId: existingBgElement.id });
          }
          updateCurrentPageProperties({
            properties: {
              backgroundColor: newBackgroundElement.backgroundColor,
            },
          });
        } else {
          // The user has pasted a media background from another page:
          // Merge this element into the existing background element on this page
          combineElements({
            firstElement: newBackgroundElement,
            secondId: existingBgElement.id,
          });
        }
      }

      // Then add all regular elements if any exist
      const nonBackgroundElements = elements.filter(
        ({ isBackground }) => !isBackground
      );
      if (nonBackgroundElements.length) {
        addElements({ elements: nonBackgroundElements });
      }
      return true;
    },
    [
      addElements,
      currentPage,
      updateCurrentPageProperties,
      combineElements,
      deleteElementById,
    ]
  );

  return addPastedElements;
}

export default useAddPastedElements;
