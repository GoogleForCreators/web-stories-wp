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
import { useStory } from '../../../../app';
import { STABLE_ARRAY } from '../../../../constants';

function useLayers() {
  const elements = useStory(
    ({ state }) =>
      state.currentPage?.elements?.map(({ id, groupId, layerName }) => ({
        id,
        groupId,
        layerName,
      })) || STABLE_ARRAY
  );

  const layers = elements.map(({ id, groupId, layerName }, index) => ({
    id,
    groupId,
    layerName,
    position: index,
  }));
  layers.reverse();
  return layers;
}

export default useLayers;
