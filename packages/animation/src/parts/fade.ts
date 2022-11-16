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
import { FieldType } from '../types';
import createAnimation from './createAnimation';

const defaults: GenericAnimation = {
  fill: 'both',
  duration: 1000,
};

export function AnimationFade({
  fadeFrom = 0,
  fadeTo = 1,
  ...args
}: { fadeFrom?: number; fadeTo?: number } & GenericAnimation) {
  const timings = { ...defaults, ...args };
  const keyframes = { opacity: [fadeFrom, fadeTo] };
  return createAnimation(keyframes, timings);
}

export const fields = {
  fadeFrom: {
    tooltip: 'Valid values range from 0 to 1',
    type: FieldType.Float,
    defaultValue: 0,
  },
  fadeTo: {
    tooltip: 'Valid values range from 0 to 1',
    type: FieldType.Float,
    defaultValue: 1,
  },
};
