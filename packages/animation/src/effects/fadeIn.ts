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
import { _x, __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import type { GenericAnimation } from '../outputs';
import { AnimationFade } from '../parts/fade';
import { FieldType } from '../types';

type EffectFlyInProps = GenericAnimation;

export function EffectFadeIn({
  duration = 600,
  delay = 0,
  easing = 'cubic-bezier(0.4, 0.4, 0.0, 1)',
}: EffectFlyInProps) {
  return AnimationFade({
    fadeFrom: 0,
    fadeTo: 1,
    duration,
    delay,
    easing,
  });
}

export const fields = {
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 600,
  },
};
