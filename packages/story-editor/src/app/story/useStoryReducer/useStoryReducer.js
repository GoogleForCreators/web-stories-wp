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
import { useReducer, useMemo } from '@googleforcreators/react';
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { exposedActions, internalActions } from './actions';
import reducer from './reducer';

const INITIAL_STATE = {
  pages: [],
  capabilities: {},
  current: null,
  products: [],
  selection: [],
  story: {},
  animationState: STORY_ANIMATION_STATE.RESET,
  copiedElementState: {},
};

/**
 * More description to follow - especially about return value.
 *
 * Invariants kept by the system:
 * - Pages is always an array.
 * - All pages have a elements array.
 * - If there's at least one page, current page points to a valid page.
 * - Selection is always a unique array (and never null, never has duplicates).
 * - Pages always have a background element which is the bottom-most element
 * - Pages are created with a default background element, which will be remembered even as other elements become background
 * - If a page is ever set to not have a background element, the default one will be inserted instead
 * - A page can only have non-duplicated element ids, however two different pages can have the same element id.
 * - If selection has multiple elements, it can never include the bottom-most (background) element.
 *
 * Invariants *not* kept by the system:
 * - New pages and objects aren't checked for id's and id's aren't validated for type.
 * - Selection isn't guaranteed to refer to objects on the current page.
 * - New pages aren't validated for type of elements property when added.
 * - No validation of keys or values in the story object.
 *
 * @param {Object} partial A state partial to initialize with.
 * @return {Object} An object with keys `state`, `internal` and `api`.
 */
function useStoryReducer(partial) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...partial,
  });

  const { internal, api } = useMemo(() => {
    const wrapWithDispatch = (actions) =>
      Object.keys(actions).reduce(
        (collection, action) => ({
          ...collection,
          [action]: actions[action](dispatch),
        }),
        {}
      );

    return {
      internal: wrapWithDispatch(internalActions),
      api: wrapWithDispatch(exposedActions),
    };
  }, [dispatch]);

  return {
    state: deepFreeze(state),
    internal,
    api,
  };
}

function deepFreeze(o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (
      Object.prototype.hasOwnProperty.call(o, prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

export default useStoryReducer;
