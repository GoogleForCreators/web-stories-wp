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
import { useReduction } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import objectWithout from '../../utils/objectWithout';

const INITIAL_STATE = {};

const reducer = {
  setPageCanvas: (map, action) => {
    const { pageId, canvas } = action.payload;
    return {
      ...map,
      [pageId]: canvas,
    };
  },
  clearPageCanvas: (map, action) => {
    const { pageId } = action.payload;
    return objectWithout(map, [pageId]);
  },
};

/**
 * Cache for holding generated page canvases.
 *
 * Small state abstraction to hold a map of pageIds to a generated canvas
 * for the relevant page.
 *
 * @return {[Object, Object]} returns useReduction return tuple [state, actions]
 */
function usePageCanvasMap() {
  return useReduction(INITIAL_STATE, reducer);
}

export default usePageCanvasMap;
