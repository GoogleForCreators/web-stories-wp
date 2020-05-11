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
import { useCallback, useMemo, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useMiddleware } from '../middleware';
import { useReducerWithMiddleware } from '../../../utils/middleware';
import reducer, { INITIAL_STATE } from './reducer';
import * as actionsToWrap from './actions';

const wrapWithDispatch = (actions, dispatch) =>
  Object.keys(actions).reduce(
    (collection, action) => ({
      ...collection,
      [action]: actions[action](dispatch),
    }),
    {}
  );

function useMediaReducer({ uploadMediaRef }) {
  const actionsRef = useRef();
  const [state, dispatch] = useReducerWithMiddleware(reducer, INITIAL_STATE, {
    middleware: useMiddleware({
      getActions: useCallback(
        () => ({
          ...actionsRef.current,
          uploadMedia: uploadMediaRef.current,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      ),
    }),
  });

  const actions = useMemo(() => wrapWithDispatch(actionsToWrap, dispatch), [
    dispatch,
  ]);
  actionsRef.current = actions;
  return {
    state,
    actions,
  };
}

export default useMediaReducer;
