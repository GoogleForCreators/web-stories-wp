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
import { useStory } from '../../../app';
import { createNewElement } from '../../../elements';

function getElementsWithBackground(elements, hasBackgroundElement) {
  // if no background element, create empty background element as first element.
  if (!hasBackgroundElement) {
    return [createNewElement('background'), ...elements];
  }

  // Otherwise wrap first element as inner of new background element.
  return [
    createNewElement('background', { inner: elements[0] }),
    ...elements.slice(1),
  ];
}

function useLayers() {
  const {
    state: { currentPage, selectedElementIds },
  } = useStory();

  let layers = [],
    hasBackgroundElement = false,
    selectedLayers = [];

  if (currentPage) {
    hasBackgroundElement = Boolean(currentPage.backgroundElementId);
    layers = getElementsWithBackground(
      currentPage.elements,
      hasBackgroundElement
    );
  }

  const backgroundElement = layers[0];
  const hasNoSelectionOrBackground =
    !hasBackgroundElement && selectedElementIds.length === 0;
  const hasBackgroundElementSelection =
    hasBackgroundElement &&
    selectedElementIds.contains(backgroundElement.inner.id);

  if (hasNoSelectionOrBackground || hasBackgroundElementSelection) {
    selectedLayers = [backgroundElement];
  } else {
    selectedLayers = [];
  }

  const handleSelectLayers = () => {};
  const handleReorderLayer = () => {};

  return {
    layers,
    selectedLayers,
    handleSelectLayers,
    handleReorderLayer,
  };
}

export default useLayers;
