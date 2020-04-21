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
 * Modified from https://github.com/anater/useReduction
 */

/**
 * External dependencies
 */
import { useReducer, useMemo } from 'react';

export default function useReduction(initialState, reducerMap) {
  const [state, dispatch] = useReducer(makeReducer(reducerMap), initialState);
  const actions = useMemo(() => makeActions(reducerMap, dispatch), [
    reducerMap,
  ]);
  return [state, actions];
}

function makeReducer(reducerMap) {
  return (state, action) => {
    // if the dispatched action is valid and there's a matching reducer, use it
    if (action && action.type && reducerMap[action.type]) {
      return reducerMap[action.type](state, action);
    }
    // always return state if the action has no reducer
    return state;
  };
}

function makeActions(reducerMap, dispatch) {
  const types = Object.keys(reducerMap);
  return types.reduce((actions, type) => {
    // if there isn't already an action with this type
    if (!actions[type]) {
      // dispatches action with type and payload when called
      actions[type] = (payload) => {
        const action = { type, payload };
        dispatch(action);
      };
    }
    return actions;
  }, {});
}
