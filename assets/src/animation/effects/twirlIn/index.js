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
import SimpleAnimation from '../../parts/simpleAnimation';

const defaultTimings = {
  delay: 0,
  duration: 1000,
  fill: 'both',
  iterations: 1,
};

const animationName = `twirl-in`;

const keyframes = [
  {
    transform: 'rotate(-540deg) scale(0.1)',
    opacity: 0,
  },
  {
    transform: 'none',
    opacity: 1,
  },
];

export function EffectTwirlIn({
  easing = 'cubic-bezier(.2,.75,.4,1)',
  ...args
}) {
  const timings = {
    ...defaultTimings,
    ...args,
    easing,
  };

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
