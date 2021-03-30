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

export function generatePulseKeyframes(scale) {
  const baseScale = 1.0;
  const intensity = scale;

  return [
    { transform: `scale(${baseScale})`, offset: 0.0 },
    { transform: `scale(${baseScale - intensity})`, offset: 0.25 },
    { transform: `scale(${baseScale + intensity})`, offset: 0.75 },
    { transform: `scale(${baseScale})`, offset: 1.0 },
  ];
}

const defaults = {
  fill: 'both',
  duration: 400,
};

export function AnimationPulse({
  iterations = 1,
  scale = 0.05,
  easing = 'cubic-bezier(0.3, 0.0, 0.0, 1)',
  ...args
}) {
  const timings = {
    ...defaults,
    ...args,
    iterations,
    easing,
  };

  const animationName = `count-${iterations}-scale-${scale}-${ANIMATION_TYPES.PULSE}`;
  const keyframes = generatePulseKeyframes(scale);

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
