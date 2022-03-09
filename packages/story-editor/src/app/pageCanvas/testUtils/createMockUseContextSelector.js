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
import { useReducer, shallowEqual, useMemo } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';

function createMockUseContextSelector(getContextValue = () => null) {
  const memoMap = {};
  const instanceRerenderMap = {};

  return {
    forceRender: () => {
      Object.values(instanceRerenderMap).forEach((forceInstanceRender) =>
        forceInstanceRender()
      );
    },

    mockUseContextSelector: (selector = (v) => v) => {
      const [, _forceRender] = useReducer((c) => c + 1, 0);

      // register this instance
      const instanceId = useMemo(() => {
        const id = uuidv4();
        instanceRerenderMap[id] = _forceRender;
        return id;
      }, []);

      // see if we want to return memoized value or not
      const newValue = selector(getContextValue());
      if (!shallowEqual(newValue, memoMap[instanceId])) {
        memoMap[instanceId] = newValue;
      }
      return memoMap[instanceId];
    },
  };
}
export default createMockUseContextSelector;
