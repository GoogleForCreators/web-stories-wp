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
import { ANIMATION_TYPES, ROTATION, AXIS } from '../../constants';
import SimpleAnimation from '../simpleAnimation';

const defaults = {
  fill: 'both',
  duration: 1000,
};

const keyframesLookup = {
  [ROTATION.CLOCKWISE]: {
    [AXIS.X]: {
      transform: ['rotateX(90deg)', 'rotateX(0deg)'],
    },
    [AXIS.Y]: {
      transform: ['rotateY(90deg)', 'rotateY(0deg)'],
    },
  },
  [ROTATION.COUNTER_CLOCKWISE]: {
    [AXIS.X]: {
      transform: ['rotateX(-90deg)', 'rotateX(0deg)'],
    },
    [AXIS.Y]: {
      transform: ['rotateY(-90deg)', 'rotateY(0deg)'],
    },
  },
};

export function AnimationFlip({
  axis = AXIS.Y,
  rotation = ROTATION.CLOCKWISE,
  ...args
}) {
  const timings = {
    ...defaults,
    ...args,
  };

  const animationName = `rot-${rotation}-axis-${axis}-${ANIMATION_TYPES.FLIP}`;
  const keyframes = keyframesLookup[rotation][axis];

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
