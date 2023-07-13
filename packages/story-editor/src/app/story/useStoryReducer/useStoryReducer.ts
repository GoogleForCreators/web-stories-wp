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

/**
 * Internal dependencies
 */
import type {
  ExternalActions,
  InternalActions,
  ReducerState,
  ReducerProviderState,
} from '../../../types';
import { INITIAL_STATE } from '../constants';
import { type DispatchType, exposedActions, internalActions } from './actions';
import reducer from './reducer';

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
 */
type Actions = InternalActions | ExternalActions;
function useStoryReducer(partial: Partial<ReducerState>): ReducerProviderState {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...partial,
  } as ReducerState);
  const { internal, api } = useMemo(() => {
    const wrapWithDispatch = <
      T extends Record<string, (props: DispatchType) => unknown>,
    >(
      actions: T
    ) =>
      Object.keys(actions).reduce(
        (collection: Actions, action) => ({
          ...collection,
          [action]: actions[action as keyof typeof actions](dispatch),
        }),
        {} as Actions
      );

    return {
      internal: wrapWithDispatch<typeof internalActions>(
        internalActions
      ) as InternalActions,
      api: wrapWithDispatch(exposedActions) as ExternalActions,
    };
  }, [dispatch]);

  return {
    state,
    internal,
    api,
  };
}

export default useStoryReducer;
