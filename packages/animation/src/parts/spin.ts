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
 * External dependencies
 */
import type { DimensionableElement } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import type { GenericAnimation } from '../outputs';
import { FieldType } from '../types';
import { defaultUnit, getGlobalSpace } from '../utils';
import createAnimation from './createAnimation';

const defaults: GenericAnimation = { fill: 'forwards', duration: 1000 };

type AnimationSpinProps = {
  rotation?: string | number;
  stopAngle?: number;
  element: DimensionableElement;
} & GenericAnimation;

export function AnimationSpin({
  rotation = 0,
  stopAngle = 0,
  element,
  ...args
}: AnimationSpinProps) {
  const global = getGlobalSpace(element);
  const timings = { ...defaults, ...args };
  const keyframes = {
    transform: [
      global`rotateZ(${defaultUnit(rotation, 'deg')})`,
      global`rotateZ(${defaultUnit(stopAngle, 'deg')})`,
    ],
  };
  return createAnimation(keyframes, timings);
}

export const fields = {
  rotation: { type: FieldType.Text, defaultValue: '0' },
  stopAngle: { type: FieldType.Text, defaultValue: '0' },
};
