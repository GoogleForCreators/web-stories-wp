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
import PropTypes from 'prop-types';
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';

function TransformProvider({ children }) {
  const transformHandlersRef = useRef({});

  const registerTransformHandler = useCallback((id, handler) => {
    const handlerListMap = transformHandlersRef.current;
    const handlerList = handlerListMap[id] || (handlerListMap[id] = []);
    handlerList.push(handler);
    return () => {
      handlerList.splice(handlerList.indexOf(handler), 1);
    };
  }, []);

  const pushTransform = useCallback((id, transform) => {
    const handlerListMap = transformHandlersRef.current;
    const handlerList = handlerListMap[id];
    if (handlerList) {
      handlerList.forEach((handler) => handler(transform));
    }
  }, []);

  const state = {
    state: {},
    actions: {
      registerTransformHandler,
      pushTransform,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

TransformProvider.propTypes = {
  children: PropTypes.node,
};

export default TransformProvider;
