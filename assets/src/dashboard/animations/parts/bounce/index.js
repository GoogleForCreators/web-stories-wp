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
import SimpleAnimation from '../simpleAnimation';

const keyframes = {
  transform: [
    'scale(0)',
    'scale(1.27)',
    'scale(0.84)',
    'scale(0.84)',
    'scale(1.1)',
    'scale(1.1)',
    'scale(0.95)',
    'scale(0.95)',
    'scale(1.03)',
    'scale(1.03)',
    'scale(0.98)',
    'scale(0.98)',
    'scale(1.02)',
    'scale(1.02)',
    'scale(0.99)',
    'scale(0.99)',
    'scale(1)',
  ],
  offset: [
    0.0,
    0.18,
    0.28,
    0.29,
    0.4,
    0.41,
    0.52,
    0.53,
    0.6,
    0.61,
    0.7,
    0.71,
    0.8,
    0.81,
    0.9,
    0.91,
    1.0,
  ],
};

const defaults = {
  fill: 'forwards',
  duration: 1500,
};

export function AnimationBounce(args) {
  const timings = {
    ...defaults,
    ...args,
  };

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    ANIMATION_TYPES.BOUNCE,
    keyframes,
    timings
  );

  return {
    id,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
    generatedKeyframes: {
      [ANIMATION_TYPES.BOUNCE]: keyframes,
    },
  };
}
