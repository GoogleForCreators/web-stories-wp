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
import localReducer, {
  INITIAL_STATE as LOCAL_INITIAL_STATE,
} from './local/reducer';
import media3pReducer, {
  INITIAL_STATE as MEDIA3P_INITIAL_STATE,
} from './media3p/reducer';
import * as actionsToWrap from './actions';

// TODO: Move initial values to the default state of each reducer function, eg:
// 'reducer(state = INITIAL_STATE, ...)'.
const INITIAL_STATE = {
  local: LOCAL_INITIAL_STATE,
  media3p: MEDIA3P_INITIAL_STATE,
};

function reducer(state, { type, payload }) {
  return {
    local: localReducer(state.local, { type, payload }),
    media3p: media3pReducer(state.media3p, { type, payload }),
  };
}

const wrapWithDispatch = (actions, dispatch) =>
  Object.keys(actions).reduce(
    (collection, action) => ({
      ...collection,
      [action]: actions[action](dispatch),
    }),
    {}
  );

function useMediaReducer() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const actions = useMemo(() => wrapWithDispatch(actionsToWrap, dispatch), []);

  return {
    // TODO: Consume 'local' and 'media3p' state separately from MediaProvider.
    state: state.local,
    actions,
  };
}

export default useMediaReducer;
