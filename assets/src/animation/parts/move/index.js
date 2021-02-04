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
import { ANIMATION_TYPES } from '../../constants';
import { defaultUnit, getGlobalSpace } from '../../utils';
import SimpleAnimation from '../simpleAnimation';

const defaults = {
  fill: 'both',
  duration: 1000,
};

export function AnimationMove({
  overflowHidden = false,
  offsetX = 0,
  offsetY = 0,
  element,
  ...args
}) {
  const global = getGlobalSpace(element);
  const timings = {
    ...defaults,
    ...args,
  };

  const animationName = `x-${offsetX}-y-${offsetY}-${ANIMATION_TYPES.MOVE}`;
  const keyframes = {
    transform: [
      global`translate3d(${defaultUnit(offsetX, 'px')}, ${defaultUnit(
        offsetY,
        'px'
      )}, 0)`,
      global`translate3d(${defaultUnit(0, 'px')}, ${defaultUnit(0, 'px')}, 0)`,
    ],
  };

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    animationName,
    keyframes,
    timings,
    overflowHidden
  );

  return {
    id,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
    generatedKeyframes: {
      [animationName]: keyframes,
    },
  };
}
