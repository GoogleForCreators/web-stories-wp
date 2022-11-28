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
import createAnimation from '../createAnimation';
import {
  AMPEffectTiming,
  AnimationDirection,
  AnimationType,
  Element,
  ScaleDirection,
} from '../../types';
import { getElementOrigin, getElementOffsets } from '../../utils';
import { EffectBackgroundPan } from './backgroundPan';
import { EffectBackgroundZoom } from './backgroundZoom';

const defaults: AMPEffectTiming = {
  fill: 'forwards',
  duration: 2000,
  easing: 'cubic-bezier(.14,.34,.47,.9)',
};

export interface PanAndZoomBackgroundEffect extends AMPEffectTiming {
  zoomDirection?: ScaleDirection;
  panDir?: AnimationDirection;
  type: AnimationType.EffectBackgroundPanAndZoom;
}

export function EffectBackgroundPanAndZoom(
  {
    zoomDirection = ScaleDirection.ScaleIn,
    panDir = AnimationDirection.RightToLeft,
    type,
    ...args
  }: PanAndZoomBackgroundEffect,
  element: Element
) {
  const timings: AMPEffectTiming = { ...defaults, ...args };

  // We have to move the origin with respect to the pan
  // direction and the current element position relative to
  // the frame. This prevents area from ever being shown
  // where the element does't fill the frame during scaling
  const origin = getElementOrigin(element && getElementOffsets(element));
  const transformOrigin =
    {
      [AnimationDirection.RightToLeft]: {
        horizontal: 0,
        vertical: origin.vertical,
      },
      [AnimationDirection.LeftToRight]: {
        horizontal: 100,
        vertical: origin.vertical,
      },
      [AnimationDirection.BottomToTop]: {
        horizontal: origin.horizontal,
        vertical: 0,
      },
      [AnimationDirection.TopToBottom]: {
        horizontal: origin.horizontal,
        vertical: 100,
      },
    }[panDir] || [];

  // Background animations aren't really composable through element nesting
  // because they all target the same dom node. To accommomdate for this we
  // manually compose the keyframes and use those to generate a new animation.
  const bgZoom = EffectBackgroundZoom(
    {
      zoomDirection,
      transformOrigin,
      type: AnimationType.EffectBackgroundZoom,
      ...args,
    },
    element
  );
  const bgPan = EffectBackgroundPan(
    {
      panDir,
      type: AnimationType.EffectBackgroundPan,
      ...args,
    },
    element
  );

  const startTransform = `${bgPan.keyframes.transform[0]} ${bgZoom.keyframes.transform[0]}`;
  const zoomLastTransformIndex = (bgZoom.keyframes.transform.length || 1) - 1;
  const panLastTransformIndex = (bgPan.keyframes.transform.length || 1) - 1;
  const endTransform = `${bgPan.keyframes.transform[zoomLastTransformIndex]} ${bgZoom.keyframes.transform[panLastTransformIndex]}`;

  const keyframes = { transform: [startTransform, endTransform] };

  return createAnimation(keyframes, timings, false, true);
}

export { fields } from './backgroundPan';
