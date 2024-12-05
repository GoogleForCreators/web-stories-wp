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
import type { ElementId } from '@googleforcreators/elements';
import { useTransformHandler } from '@googleforcreators/transform';
import type { RefObject } from 'react';
import type { Solid } from '@googleforcreators/patterns';

function useCSSVarColorTransformHandler({
  id,
  targetRef,
  cssVar,
  expectedStyle,
}: {
  id: ElementId;
  targetRef: RefObject<HTMLElement>;
  cssVar: string;
  expectedStyle: string;
}) {
  useTransformHandler(id, (transform) => {
    const target = targetRef.current;
    if (target) {
      if (transform === null) {
        target.style.removeProperty(cssVar);
      } else {
        const { color, style } = transform;
        if (color && style === expectedStyle) {
          const {
            color: { r, g, b, a },
          } = color as Solid;
          target.style.setProperty(
            cssVar,
            `rgba(${r}, ${g}, ${b}, ${a !== undefined ? a : 1})`
          );
        }
      }
    }
  });
}

export default useCSSVarColorTransformHandler;
