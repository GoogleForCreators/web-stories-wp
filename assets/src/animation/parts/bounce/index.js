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

const keyframes = [
  { transform: 'scale(0)', offset: 0.0 },
  { transform: 'scale(1.27)', offset: 0.18 },
  { transform: 'scale(0.84)', offset: 0.28 },
  { transform: 'scale(0.84)', offset: 0.29 },
  { transform: 'scale(1.1)', offset: 0.4 },
  { transform: 'scale(1.1)', offset: 0.41 },
  { transform: 'scale(0.95)', offset: 0.52 },
  { transform: 'scale(0.95)', offset: 0.53 },
  { transform: 'scale(1.03)', offset: 0.6 },
  { transform: 'scale(1.03)', offset: 0.61 },
  { transform: 'scale(0.98)', offset: 0.7 },
  { transform: 'scale(0.98)', offset: 0.71 },
  { transform: 'scale(1.02)', offset: 0.8 },
  { transform: 'scale(1.02)', offset: 0.81 },
  { transform: 'scale(0.99)', offset: 0.9 },
  { transform: 'scale(0.99)', offset: 0.91 },
  { transform: 'scale(1)', offset: 1 },
];

const defaults = {
  fill: 'both',
  duration: 1500,
};

export function AnimationBounce(args) {
  const timings = {
    ...defaults,
    ...args,
  };

  const animationName = ANIMATION_TYPES.BOUNCE;

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
