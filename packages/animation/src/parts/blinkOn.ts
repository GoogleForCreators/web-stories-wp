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
import generateLookupMap from '../utils/generateLookupMap';
import padArray from '../utils/padArray';
import { AMPEffectTiming, AnimationType, FieldType } from '../types';
import createAnimation from './createAnimation';

const DEFAULT_BLINKS = 10;
const AVAILABLE_OPACITY = [0, 0.25, 0.75, 1];

const defaults: AMPEffectTiming = { fill: 'forwards' };

function range(i: number) {
  return Array<number>(i)
    .fill(0)
    .map((_v, k) => k);
}

function generateOpacityFrames(blinkCount: number = DEFAULT_BLINKS) {
  const lookup = generateLookupMap(AVAILABLE_OPACITY);

  let lastOpacity: number | null = null;
  const opacityFrames = range(blinkCount - 2).map(() => {
    const opacities: number[] =
      lastOpacity !== null ? lookup[lastOpacity] : AVAILABLE_OPACITY;
    const opacity = opacities[Math.floor(Math.random() * opacities.length)];
    lastOpacity = opacity;
    return opacity;
  });

  return padArray(opacityFrames, 3);
}

export interface BlinkOnAnimation extends AMPEffectTiming {
  blinkCount?: number;
  type: AnimationType.BlinkOn;
}

export function AnimationBlinkOn({
  blinkCount = DEFAULT_BLINKS,
  type,
  ...args
}: BlinkOnAnimation) {
  const timings: AMPEffectTiming = { ...defaults, ...args };
  const keyframes = { opacity: [0, ...generateOpacityFrames(blinkCount), 1] };
  return createAnimation(keyframes, timings);
}

export const fields = {
  blinkCount: { type: FieldType.Number, defaultValue: DEFAULT_BLINKS },
};
