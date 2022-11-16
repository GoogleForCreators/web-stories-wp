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
import createAnimation from '../parts/createAnimation';
import { getGlobalSpace } from '../utils';

const defaultTimings: GenericAnimation = {
  delay: 0,
  duration: 1000,
  fill: 'both',
  iterations: 1,
  easing: 'cubic-bezier(0.4, 0.4, 0.0, 1)',
};

type EffectTwirlInProps = {
  element: DimensionableElement;
} & GenericAnimation;

export function EffectTwirlIn({ element, ...args }: EffectTwirlInProps) {
  const global = getGlobalSpace(element);
  const keyframes = {
    transform: [global`rotate(-540deg) scale(0.1)`, 'none'],
    opacity: [0, 1],
  };
  const timings = { ...defaultTimings, ...args };
  return createAnimation(keyframes, timings);
}
