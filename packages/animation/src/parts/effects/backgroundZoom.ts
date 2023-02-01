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
import { clamp, progress, lerp } from '@googleforcreators/units';
import { sprintf, _x, __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { BG_MIN_SCALE, BG_MAX_SCALE } from '../../constants';
import { getElementOffsets, getElementOrigin } from '../../utils';
import { AnimationZoom } from '../simple/zoom';
import {
  type AMPEffectTiming,
  AnimationType,
  type Element,
  FieldType,
  isScaledElement,
  ScaleDirection,
} from '../../types';

type TransformOrigin = {
  vertical: number;
  horizontal: number;
};

export interface ZoomBackgroundEffect extends AMPEffectTiming {
  type: AnimationType.EffectBackgroundZoom;
  zoomDirection?: ScaleDirection;
  transformOrigin?: TransformOrigin;
}

export function EffectBackgroundZoom(
  {
    zoomDirection = ScaleDirection.ScaleOut,
    transformOrigin,
    duration = 2000,
    delay = 0,
    easing = 'cubic-bezier(.3,0,.55,1)',
  }: ZoomBackgroundEffect,
  element: Element
) {
  // Define the min/max range based off the element scale
  // at element scale 400, the range should be [1/4, 1]
  // at element scale 100, the range should be [1, 4]
  if (!isScaledElement(element)) {
    throw new Error('Should not happen');
  }

  const range = {
    MIN: BG_MIN_SCALE / (element.scale || 1),
    MAX: BG_MAX_SCALE / (element.scale || 1),
  };

  // Compute what a 50% difference is relative to [0%, 400%]
  const normalizedDelta = progress(50, { MIN: 0, MAX: BG_MAX_SCALE });
  // Interpret the normalized delta into the compounded scale coordinate space.
  const delta = lerp(normalizedDelta, { MIN: 0, MAX: range.MAX });
  // Apply the interpretted fixed delta to the elements scale
  const zoomFrom =
    1 + (zoomDirection === ScaleDirection.ScaleOut ? 1 : -1) * delta;

  return AnimationZoom({
    type: AnimationType.Zoom,
    // make sure we stay within min/max range so image always fills canvas
    zoomFrom: clamp(zoomFrom, range),
    zoomTo: 1,
    duration,
    delay,
    easing,
    targetLeafElement: true,
    // Account for moving bg element relative to frame
    transformOrigin:
      transformOrigin ||
      getElementOrigin(element && getElementOffsets(element)),
  });
}

export const fields = {
  zoomDirection: {
    label: __('Direction', 'web-stories'),
    tooltip: sprintf(
      /* translators: 1: scaleIn. 2: scaleOut */
      __('Valid values are %1$s or %2$s', 'web-stories'),
      'scaleIn',
      'scaleOut'
    ),
    type: FieldType.DirectionPicker,
    values: [ScaleDirection.ScaleIn, ScaleDirection.ScaleOut],
    defaultValue: ScaleDirection.ScaleOut,
  },
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 2000,
  },
};
