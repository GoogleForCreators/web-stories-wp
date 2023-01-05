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
import { useBatchingCallback } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import type { Element, Group, Groups } from '@googleforcreators/elements';
import type { StoryAnimation } from '@googleforcreators/animation';
import { elementIs } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../story';

function useAddPastedElements() {
  const {
    currentPage,
    addElements,
    addGroup,
    updateCurrentPageProperties,
    deleteElementById,
    combineElements,
    addAnimations,
  } = useStory(
    ({
      state: { currentPage },
      actions: {
        addElements,
        addGroup,
        deleteSelectedElements,
        updateCurrentPageProperties,
        deleteElementById,
        combineElements,
        addAnimations,
      },
    }) => {
      return {
        currentPage,
        addElements,
        addGroup,
        deleteSelectedElements,
        updateCurrentPageProperties,
        deleteElementById,
        combineElements,
        addAnimations,
      };
    }
  );

  const addPastedElements = useBatchingCallback<
    Element[],
    StoryAnimation[] | undefined,
    Groups | undefined,
    boolean
  >(
    (
      elements: Element[],
      animations: StoryAnimation[] = [],
      groups: Groups = {}
    ) => {
      if (elements.length === 0 || !currentPage) {
        return false;
      }

      // If a bg element is pasted, handle that first
      const newBackgroundElement = elements
        .filter(elementIs.backgroundable)
        .find(({ isBackground }) => isBackground);
      let newAnimations = animations;
      if (newBackgroundElement) {
        const existingBgElement = currentPage.elements[0];
        if (elementIs.defaultBackground(newBackgroundElement)) {
          // The user has pasted a non-media background from another page:
          // Delete existing background (if any) and then update page
          // with this default element background color
          if (!elementIs.defaultBackground(existingBgElement)) {
            deleteElementById({ elementId: existingBgElement.id });
          }
          updateCurrentPageProperties({
            properties: {
              backgroundColor: newBackgroundElement.backgroundColor,
            },
          });
        } else {
          // Since background will maintain id, we update any
          // new animations to have the proper target
          newAnimations = animations.map((animation) =>
            animation.targets.includes(newBackgroundElement.id)
              ? { ...animation, targets: [existingBgElement.id] }
              : animation
          );
          // The user has pasted a media background from another page:
          // Merge this element into the existing background element on this page
          combineElements({
            firstElement: newBackgroundElement,
            secondId: existingBgElement.id,
            shouldRetainAnimations: false,
          });
        }
      }

      // Then add all regular elements if any exist
      const nonBackgroundElements = elements.filter(
        (element) => !elementIs.backgroundable(element) || !element.isBackground
      );
      const groupsEntries = Object.entries(groups);
      const newGroups: [[string, string], Group][] = groupsEntries.map(
        ([oldGroupId, group]) => {
          const newGroupId = uuidv4();
          return [[oldGroupId, newGroupId], group];
        }
      );
      const nonBackgroundElementsWithNewGroups = nonBackgroundElements.map(
        (el) => {
          if (!el.groupId) {
            return el;
          }
          const newGroup = newGroups.find(
            ([[oldGroupId]]) => oldGroupId === el.groupId
          );
          if (!newGroup) {
            return el;
          }
          const [[, newGroupId]] = newGroup;
          return {
            ...el,
            groupId: newGroupId,
          };
        }
      );
      if (nonBackgroundElementsWithNewGroups.length) {
        addElements({ elements: nonBackgroundElementsWithNewGroups });
      }

      if (newGroups.length) {
        for (const newGroup of newGroups) {
          const [[, newGroupId], group] = newGroup;
          addGroup({ groupId: newGroupId, name: group.name });
        }
      }

      // Add any animations associated with the new elements
      addAnimations({ animations: newAnimations });

      return true;
    },
    [
      addElements,
      addGroup,
      currentPage,
      updateCurrentPageProperties,
      combineElements,
      deleteElementById,
      addAnimations,
    ]
  );

  return addPastedElements;
}

export default useAddPastedElements;
