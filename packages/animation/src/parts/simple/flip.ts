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
import {
  AMPEffectTiming,
  AnimationType,
  Axis,
  FieldType,
  Rotation,
} from '../../types';
import createAnimation from '../createAnimation';

const defaults: AMPEffectTiming = { fill: 'both', duration: 1000 };

const keyframesLookup = {
  [Rotation.Clockwise]: {
    [Axis.X]: {
      transform: ['rotateX(90deg)', 'rotateX(0deg)'],
    },
    [Axis.Y]: {
      transform: ['rotateY(90deg)', 'rotateY(0deg)'],
    },
  },
  [Rotation.CounterClockwise]: {
    [Axis.X]: {
      transform: ['rotateX(-90deg)', 'rotateX(0deg)'],
    },
    [Axis.Y]: {
      transform: ['rotateY(-90deg)', 'rotateY(0deg)'],
    },
  },
  [Rotation.PingPong]: {
    [Axis.X]: {
      transform: [],
    },
    [Axis.Y]: {
      transform: [],
    },
  },
};

export interface FlipAnimation extends AMPEffectTiming {
  axis: Axis;
  rotation: Rotation;
  type: AnimationType.Flip;
}

export function AnimationFlip({
  axis = Axis.Y,
  rotation = Rotation.Clockwise,
  type,
  ...args
}: FlipAnimation) {
  const timings: AMPEffectTiming = { ...defaults, ...args };
  const keyframes = keyframesLookup[rotation][axis];
  return createAnimation(keyframes, timings);
}

export const fields = {
  axis: {
    type: FieldType.Dropdown,
    values: [Axis.X, Axis.Y],
    defaultValue: Axis.Y,
  },
  rotation: {
    type: FieldType.Dropdown,
    values: [Rotation.Clockwise, Rotation.CounterClockwise],
    defaultValue: Rotation.Clockwise,
  },
};
