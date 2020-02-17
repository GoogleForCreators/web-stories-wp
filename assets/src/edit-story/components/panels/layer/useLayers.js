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

function getLayersFromElements(elements, hasBackground) {
  // if no background element, create empty background element as first element.
  if (!hasBackground) {
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
    state: { currentPage },
  } = useStory();

  if (!currentPage) {
    return [];
  }

  const hasBackground = Boolean(currentPage.backgroundElementId);
  const rawLayers = getLayersFromElements(currentPage.elements, hasBackground);

  // We need an index going in the "correct" order for data manipulation
  const offset = hasBackground ? 0 : -1;
  const layers = rawLayers.map((layer, index) => ({
    ...layer,
    position: index + offset,
  }));
  layers.reverse();
  return layers;
}

export default useLayers;
