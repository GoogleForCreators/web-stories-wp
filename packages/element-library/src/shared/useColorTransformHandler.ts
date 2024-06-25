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
import {
  generatePatternStyles,
  convertToCSS,
  type Solid,
} from '@googleforcreators/patterns';
import { useTransformHandler } from '@googleforcreators/transform';
import type { ElementId } from '@googleforcreators/elements';
import type { RefObject } from 'react';

function useColorTransformHandler({
  id,
  targetRef,
  expectedStyle,
  resetOnNullTransform = true,
}: {
  id: ElementId;
  targetRef: RefObject<HTMLElement | null>;
  expectedStyle?: string;
  resetOnNullTransform?: boolean;
}) {
  useTransformHandler(id, (transform) => {
    // @ts-expect-error -- Can only be an HTMLElement or null.
    const target: HTMLElement | null =
      undefined !== targetRef?.current ? targetRef.current : targetRef;
    if (target) {
      if (transform === null) {
        if (resetOnNullTransform) {
          target.style.cssText = '';
        }
      } else {
        const { color, style } = transform;
        // If the transforming style and the expected style don't match, return.
        if (expectedStyle && expectedStyle !== style) {
          return;
        }
        if (color && style) {
          // In case we're changing text color, we need the children instead of the element itself.
          if ('color' === style && target.children?.length > 0) {
            const toApply = convertToCSS(
              generatePatternStyles(color as Solid, style)
            );
            for (const node of target.children) {
              (node as HTMLElement).style.cssText = toApply;
            }
          } else {
            target.style.cssText = convertToCSS(
              generatePatternStyles(color as Solid, style)
            );
          }
        }
      }
    }
  });
}

export default useColorTransformHandler;
