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
import { useEffect } from '@googleforcreators/react';
import type { DependencyList } from 'react';

/**
 * Internal dependencies
 */
import useTransform from './useTransform';
import type { TransformHandler } from './types';

/**
 * @param id Target element's id.
 * @param handler The transform handler. The argument is
 * the frame object. The `null` value resets the transform.
 * @param [deps] The effect's dependencies.
 */
function useTransformHandler(
  id: string,
  handler: TransformHandler,
  deps: DependencyList | undefined = undefined
) {
  const registerTransformHandler = useTransform(
    ({ actions }) => actions.registerTransformHandler
  );

  useEffect(
    () => registerTransformHandler?.(id, handler),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We want to pass through provided deps.
    deps
  );
}

export default useTransformHandler;
