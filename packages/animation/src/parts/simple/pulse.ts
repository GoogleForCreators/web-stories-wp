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
import type { AMPEffectTiming, AnimationType } from '../../types';
import createAnimation from '../createAnimation';

export function generatePulseKeyframes(scale: number) {
  const baseScale = 1.0;
  const intensity = scale;

  return {
    transform: [
      `scale(${baseScale})`,
      `scale(${baseScale + intensity})`,
      `scale(${baseScale - intensity / 10})`,
      `scale(${baseScale})`,
    ],
    offset: [0.0, 0.33, 0.66, 1.0],
  };
}

const defaults: AMPEffectTiming = { fill: 'both', duration: 400 };

export interface PulseAnimation extends AMPEffectTiming {
  type: AnimationType.Pulse;
  scale?: number;
}

export function AnimationPulse({
  iterations = 1,
  scale = 0.5,
  easing = 'cubic-bezier(0.3, 0.0, 0.0, 1)',
  type,
  ...args
}: PulseAnimation) {
  const timings: AMPEffectTiming = {
    ...defaults,
    ...args,
    iterations,
    easing,
  };
  const keyframes = generatePulseKeyframes(scale);
  return createAnimation(keyframes, timings);
}
