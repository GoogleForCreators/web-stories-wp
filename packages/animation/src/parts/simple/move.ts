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
  Element,
  FieldType,
} from '../../types';
import { defaultUnit, getGlobalSpace } from '../../utils';
import createAnimation from '../createAnimation';

const defaults: AMPEffectTiming = { fill: 'both', duration: 1000 };

export interface MoveAnimation extends AMPEffectTiming {
  type: AnimationType.Move;
  overflowHidden?: boolean;
  offsetX?: string | number;
  offsetY?: string | number;
}

export function AnimationMove(
  {
    overflowHidden = false,
    offsetX = 0,
    offsetY = 0,
    type,
    ...args
  }: MoveAnimation,
  element: Element
) {
  const global = getGlobalSpace(element);
  const timings: AMPEffectTiming = { ...defaults, ...args };
  const keyframes = {
    transform: [
      global`translate3d(${defaultUnit(offsetX, 'px')}, ${defaultUnit(
        offsetY,
        'px'
      )}, 0)`,
      global`translate3d(${defaultUnit(0, 'px')}, ${defaultUnit(0, 'px')}, 0)`,
    ],
  };

  return createAnimation(keyframes, timings, overflowHidden);
}

export const fields = {
  overflowHidden: { type: FieldType.Checkbox, defaultValue: false },
  offsetX: { type: FieldType.Text, defaultValue: 0 },
  offsetY: { type: FieldType.Text, defaultValue: 0 },
};
