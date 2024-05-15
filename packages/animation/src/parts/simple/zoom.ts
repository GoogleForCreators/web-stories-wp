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
  type AMPEffectTiming,
  type AnimationType,
  FieldType,
} from '../../types';
import createAnimation from '../createAnimation';

const defaults: AMPEffectTiming = { fill: 'forwards', duration: 1000 };

export interface ZoomAnimation extends AMPEffectTiming {
  type: AnimationType.Zoom;
  zoomFrom?: number;
  zoomTo?: number;
  targetLeafElement?: boolean;
  transformOrigin?: {
    horizontal: number;
    vertical: number;
  };
}

export function AnimationZoom({
  zoomFrom = 0,
  zoomTo = 1,
  targetLeafElement = false,
  transformOrigin,
  type,
  ...args
}: ZoomAnimation) {
  const timings = { ...defaults, ...args };
  const keyframes = { transform: [`scale(${zoomFrom})`, `scale(${zoomTo})`] };

  // If supplied a transformOrigin, AMP doesn't allow us to set
  // the transformOrigin property from the keyframes since it is
  // an unanimatable property. To account for this we calculate a
  // counter translate based off the scale change that mimics the
  // element scaling from a particular origin.
  if (transformOrigin) {
    // transformOrigin default is `50% 50%` so we account for
    // that here in our calculations.
    const originRelativeToCenter = {
      x: 50 - transformOrigin.horizontal,
      y: 50 - transformOrigin.vertical,
    };
    const counterScaleTranslate = {
      x: (zoomFrom - 1) * originRelativeToCenter.x,
      y: (zoomFrom - 1) * originRelativeToCenter.y,
    };
    keyframes.transform = [
      `translate(${counterScaleTranslate.x}%, ${counterScaleTranslate.y}%) ${keyframes.transform[0]}`,
      `translate(0%, 0%) ${keyframes.transform[1]}`,
    ];
  }

  return createAnimation(keyframes, timings, false, targetLeafElement);
}

export const fields = {
  zoomFrom: {
    tooltip: 'Valid values range from 0 to 1',
    type: FieldType.Float,
    defaultValue: 0,
  },
  zoomTo: {
    tooltip: 'Valid values range from 0 to 1',
    type: FieldType.Float,
    defaultValue: 1,
  },
};
