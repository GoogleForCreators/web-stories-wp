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
import { AnimationPulse } from '../simple/pulse';
import { AMPEffectTiming, AnimationType, FieldType } from '../../types';

export interface PulseEffect extends AMPEffectTiming {
  scale?: number;
  type: AnimationType.EffectPulse;
}

export function EffectPulse({
  iterations = 1,
  scale = 0.5,
  duration = 1450,
  delay,
  easing = 'ease-in-out',
}: PulseEffect) {
  return AnimationPulse({
    scale,
    duration,
    delay,
    easing,
    iterations,
    type: AnimationType.Pulse,
  });
}

export const fields = {
  scale: {
    label: __('Scale', 'web-stories'),
    tooltip: 'Valid values are greater than or equal to 0',
    type: FieldType.Float,
    defaultValue: 0.5,
  },
  iterations: {
    label: _x('Pulses', 'number of pulses', 'web-stories'),
    type: FieldType.Float,
    defaultValue: 1,
  },
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 1450,
  },
};
