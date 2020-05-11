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
import { useMemo, useReducer, useRef } from 'react';

/**
 * An alternative to useReducer, that also accepts middleware.
 *
 * The middleware concept is the same as the one provided by Redux, see:
 * https://redux.js.org/advanced/middleware.
 *
 * @param {function(state, action)} reducer Reducer function.
 * @param {Object} initialArg Initial state value.
 * @param {Array.<function(state, action, next)>}
 *        An array of middleware functions.
 * @return {[state, dispatch]}
 *         The current value of the state, and a function that's used to
 *         dispatch actions to the reducer and middleware.
 */
function useReducerWithMiddleware(reducer, initialArg, { middleware }) {
  const [state, dispatch] = useReducer(reducer, initialArg);

  const stateRef = useRef(state);
  stateRef.current = state;

  const dispatchWithMiddleware = middleware
    ? // eslint-disable-next-line react-hooks/exhaustive-deps
      useMemo(() => applyMiddleware(stateRef, dispatch, middleware), [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...middleware,
      ])
    : dispatch;
  return [state, dispatchWithMiddleware];
}

function applyMiddleware(stateRef, next, middleware, i = 0) {
  const actualNext =
    i === middleware.length - 1
      ? next
      : applyMiddleware(stateRef, next, middleware, i + 1);
  return (action) => middleware[i](stateRef.current, action, actualNext);
}

export { useReducerWithMiddleware };
