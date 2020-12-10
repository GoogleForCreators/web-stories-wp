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
 * Internal dependencies
 */
import { DIRECTION } from '../../constants';
import { AnimationMove } from '../../parts/move';
import { getOffPageOffset } from '../../utils';

export function EffectFlyIn({
  duration = 600,
  flyInDir = DIRECTION.TOP_TO_BOTTOM,
  delay,
  easing = 'cubic-bezier(0.2, 0.6, 0.0, 1)',
  element,
}) {
  const { offsetTop, offsetLeft, offsetRight, offsetBottom } = getOffPageOffset(
    element
  );

  const offsetLookup = {
    [DIRECTION.TOP_TO_BOTTOM]: {
      offsetY: `${offsetTop}%`,
    },
    [DIRECTION.BOTTOM_TO_TOP]: {
      offsetY: `${offsetBottom}%`,
    },
    [DIRECTION.LEFT_TO_RIGHT]: {
      offsetX: `${offsetLeft}%`,
    },
    [DIRECTION.RIGHT_TO_LEFT]: {
      offsetX: `${offsetRight}%`,
    },
  };

  return new AnimationMove({
    ...offsetLookup[flyInDir],
    duration,
    delay,
    easing,
    element,
  });
}
