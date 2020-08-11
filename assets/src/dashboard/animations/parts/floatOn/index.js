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
import { ANIMATION_TYPES, DIRECTION } from '../../constants';
import SimpleAnimation from '../simpleAnimation';

const defaults = {
  fill: 'both',
  duration: 1000,
};

const keyframesLookup = {
  [DIRECTION.TOP_TO_BOTTOM]: {
    transform: ['translateY(-100%)', 'translateY(0%)'],
  },
  [DIRECTION.BOTTOM_TO_TOP]: {
    transform: ['translateY(100%)', 'translateY(0%)'],
  },
  [DIRECTION.LEFT_TO_RIGHT]: {
    transform: ['translateX(-100%)', 'translateX(0%)'],
  },
  [DIRECTION.RIGHT_TO_LEFT]: {
    transform: ['translateX(100%)', 'translateX(0%)'],
  },
};

export function AnimationFloatOn({
  floatOnDir = DIRECTION.BOTTOM_TO_TOP,
  ...args
}) {
  const timings = {
    ...defaults,
    ...args,
  };

  const animationName = `dir-${floatOnDir}-${ANIMATION_TYPES.FLOAT_ON}`;
  const keyframes = keyframesLookup[floatOnDir];

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    animationName,
    keyframes,
    timings
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
