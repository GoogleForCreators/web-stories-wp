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
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { mergeElements } from '../elements';
import { useStory } from '../app';

function useDropTargets(selectedElement) {
  const {
    actions: { updateElementById },
    state: { activeDropTarget, currentPage },
  } = useStory();

  const [previewing, setPreviewing] = useState(false);
  const [savedElement, setSavedElement] = useState(null);

  const combineElements = useCallback(() => {
    if (!activeDropTarget || activeDropTarget === selectedElement.id) {
      return;
    }
    const dropTarget = currentPage.elements.find(
      (element) => element.id === activeDropTarget
    );
    setSavedElement({ ...dropTarget });
    updateElementById({
      elementId: activeDropTarget,
      properties: mergeElements(selectedElement, dropTarget),
    });
  }, [
    activeDropTarget,
    currentPage /** .elements */,
    selectedElement,
    updateElementById,
  ]);

  const previewDropTarget = useCallback(() => {
    if (
      activeDropTarget &&
      activeDropTarget !== selectedElement.id &&
      !previewing
    ) {
      const dropTarget = currentPage.elements.find(
        (element) => element.id === activeDropTarget
      );
      setSavedElement({ ...dropTarget });
      setPreviewing(true);
      combineElements();
    } else if (previewing && !activeDropTarget) {
      if (savedElement) {
        updateElementById({
          elementId: savedElement.id,
          properties: savedElement,
        });
      }
      setSavedElement(null);
      setPreviewing(false);
    }
  }, [
    activeDropTarget,
    combineElements,
    currentPage /** .elements */,
    previewing,
    savedElement,
    selectedElement /** .id */,
    updateElementById,
  ]);

  return { previewDropTarget, combineElements };
}

export default useDropTargets;
