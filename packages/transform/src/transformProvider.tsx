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
import { useCallback, useRef, useState } from '@googleforcreators/react';
import type { ReactNode } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';
import type {
  HandlersList,
  TransformsList,
  Transform,
  TransformHandler,
} from './types';

function TransformProvider({ children }: { children: ReactNode }) {
  const transformHandlersRef = useRef<HandlersList>({});
  const lastTransformsRef = useRef<TransformsList>({});
  const [isAnythingTransforming, setIsAnythingTransforming] = useState(false);

  const registerTransformHandler = useCallback(
    (id: string, handler: TransformHandler) => {
      const handlerListMap = transformHandlersRef.current;
      const handlerList = handlerListMap[id] || (handlerListMap[id] = []);
      handlerList.push(handler);
      return () => {
        handlerList.splice(handlerList.indexOf(handler), 1);
      };
    },
    []
  );

  const pushTransform = useCallback((id: string, transform: Transform) => {
    const handlerListMap = transformHandlersRef.current;
    const lastTransforms = lastTransformsRef.current;
    const handlerList = handlerListMap[id];

    if (handlerList) {
      handlerList.forEach((handler) => handler(transform));
    }

    if (transform === null) {
      lastTransforms[id] = null;
    } else {
      lastTransforms[id] = { ...lastTransforms[id], ...transform };
    }

    if (isDoneTransform(lastTransforms[id])) {
      const allTransformsDone =
        Object.values(lastTransforms).every(isDoneTransform);
      if (allTransformsDone) {
        lastTransformsRef.current = {};
        setIsAnythingTransforming(false);
      }
      // isAnythingTransforming is relevant for transformations relevant to Moveable.
      // Suppress communicating static transformations to the world.
    } else if (!transform.staticTransformation) {
      setIsAnythingTransforming(true);
    }
  }, []);

  const clearTransforms = useCallback(() => {
    lastTransformsRef.current = {};
    setIsAnythingTransforming(false);
  }, [setIsAnythingTransforming]);

  const state = {
    state: {
      isAnythingTransforming,
    },
    actions: {
      registerTransformHandler,
      pushTransform,
      clearTransforms,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

const isDoneTransform = (transform: null | object) => {
  if (transform === null) {
    return true;
  }
  const transformKeys = Object.keys(transform);
  return transformKeys.length === 1 && 'dropTargets' in transform;
};

export default TransformProvider;
