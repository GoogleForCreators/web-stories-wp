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
import type { GenericAnimation } from '../outputs';
import { AnimationDirection, FieldType } from '../types';
import createAnimation from './createAnimation';

const defaults: GenericAnimation = { fill: 'both', duration: 1000 };

const keyframesLookup: Record<
  AnimationDirection,
  { transform: [string, string] }
> = {
  [AnimationDirection.TopToBottom]: {
    transform: ['translateY(-100%)', 'translateY(0%)'],
  },
  [AnimationDirection.BottomToTop]: {
    transform: ['translateY(100%)', 'translateY(0%)'],
  },
  [AnimationDirection.LeftToRight]: {
    transform: ['translateX(-100%)', 'translateX(0%)'],
  },
  [AnimationDirection.RightToLeft]: {
    transform: ['translateX(100%)', 'translateX(0%)'],
  },
};

export function AnimationFloatOn({
  floatOnDir = AnimationDirection.BottomToTop,
  ...args
}: { floatOnDir: AnimationDirection } & GenericAnimation) {
  const timings: GenericAnimation = { ...defaults, ...args };
  const keyframes = keyframesLookup[floatOnDir];
  return createAnimation(keyframes, timings);
}

export const fields = {
  floatOnDir: {
    type: FieldType.Dropdown,
    values: [
      AnimationDirection.TopToBottom,
      AnimationDirection.BottomToTop,
      AnimationDirection.LeftToRight,
      AnimationDirection.RightToLeft,
    ],
    defaultValue: AnimationDirection.BottomToTop,
  },
};
