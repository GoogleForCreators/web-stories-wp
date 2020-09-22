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
import { useReducer, useMemo } from 'react';

/**
 * Internal dependencies
 */
import localReducer from './local/reducer';
import media3pReducer from './media3p/reducer';
import * as localActionsToWrap from './local/actions';
import * as media3pActionsToWrap from './media3p/actions';
import * as types from './types';

/**
 * @typedef {import('./media3p/typedefs').Media3pContextState} Media3pContextState
 * @typedef {import('./media3p/typedefs').Media3pContextActions} Media3pContextActions
 * @typedef {import('./local/typedefs').LocalMediaContextState} LocalMediaContextState
 * @typedef {import('./local/typedefs').LocalMediaContextActions} LocalMediaContextActions
 */

function rootReducer(state = {}, { type, payload }) {
  return {
    local: localReducer(state.local, { type, payload }),
    media3p: media3pReducer(state.media3p, { type, payload }),
  };
}

const wrapWithDispatch = (actionFnOrActionObject, dispatch) => {
  if (actionFnOrActionObject instanceof Function) {
    return actionFnOrActionObject(dispatch);
  }

  const actions = actionFnOrActionObject;
  return Object.keys(actions).reduce(
    (collection, action) => ({
      ...collection,
      [action]: wrapWithDispatch(actions[action], dispatch),
    }),
    {}
  );
};

/**
 * Media reducer object used to created the MediaContext
 *
 * @typedef MediaReducer
 * @property {Object} state Reducer state of media3p and local.
 * @property {LocalMediaContextState} state.local local state
 * @property {Media3pContextState} state.media3p media3p state
 * @property {Object} actions Reducer actions of media3p and local.
 * @property {LocalMediaContextActions} actions.local local actions
 * @property {Media3pContextActions} actions.media3p media3p actions
 */

/**
 * The media state reducer and action dispatcher functions.
 *
 * @param {Function} reducer The reducer, which may be overriden for unit
 * testing purposes
 * @param {Object} actionsToWrap The action dispatcher functions, that are
 * wrapped with the `dispatch` function and may be overriden for unit testing
 * purposes
 * @return {MediaReducer} Media reducer object.
 */
function useMediaReducer(reducer = rootReducer, actionsToWrap) {
  const defaultActionsToWrap = useMemo(
    () => ({ local: localActionsToWrap, media3p: media3pActionsToWrap }),
    []
  );
  actionsToWrap = actionsToWrap ?? defaultActionsToWrap;

  const initialValue = useMemo(
    () => reducer(undefined, { type: types.INITIAL_STATE }),
    [reducer]
  );
  const [state, dispatch] = useReducer(reducer, initialValue);

  const wrappedActions = useMemo(
    () => wrapWithDispatch(actionsToWrap, dispatch),
    [actionsToWrap]
  );

  return {
    state,
    actions: wrappedActions,
  };
}

export default useMediaReducer;
