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
import { sprintf, _x, __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import createAnimation from '../createAnimation';
import {
  type AMPEffectTiming,
  AnimationDirection,
  AnimationType,
  type Element,
  FieldType,
} from '../../types';
import { getElementOffsets } from '../../utils';

export interface PanBackgroundEffect extends AMPEffectTiming {
  panDir?: AnimationDirection;
  type: AnimationType.EffectBackgroundPan;
}

export function EffectBackgroundPan(
  {
    panDir = AnimationDirection.RightToLeft,
    duration = 2000,
    easing = 'cubic-bezier(.3,0,.55,1)',
    type,
    ...args
  }: PanBackgroundEffect,
  element: Element
) {
  const timings: AMPEffectTiming = {
    fill: 'both',
    duration,
    easing,
    ...args,
  };

  const translateToOriginX = 'translate3d(0%, 0, 0)';
  const translateToOriginY = 'translate3d(0, 0%, 0)';
  const offsets = element
    ? getElementOffsets(element)
    : { top: 0, right: 0, bottom: 0, left: 0 };
  const translate = {
    from: {
      [AnimationDirection.RightToLeft]: `translate3d(${offsets.left}%, 0, 0)`,
      [AnimationDirection.LeftToRight]: `translate3d(${offsets.right}%, 0, 0)`,
      [AnimationDirection.BottomToTop]: `translate3d(0, ${offsets.top}%, 0)`,
      [AnimationDirection.TopToBottom]: `translate3d(0, ${offsets.bottom}%, 0)`,
    },
    to: {
      [AnimationDirection.RightToLeft]: translateToOriginX,
      [AnimationDirection.LeftToRight]: translateToOriginX,
      [AnimationDirection.BottomToTop]: translateToOriginY,
      [AnimationDirection.TopToBottom]: translateToOriginY,
    },
  };

  const keyframes = {
    transform: [translate.from[panDir], translate.to[panDir]],
  };

  return createAnimation(keyframes, timings, false, true);
}

export const fields = {
  panDir: {
    label: __('Direction', 'web-stories'),
    tooltip: sprintf(
      /* translators: 1: scaleIn. 2: scaleOut */
      __('Valid values are %1$s or %2$s', 'web-stories'),
      'scaleIn',
      'scaleOut'
    ),
    type: FieldType.DirectionPicker,
    values: [
      AnimationDirection.TopToBottom,
      AnimationDirection.BottomToTop,
      AnimationDirection.LeftToRight,
      AnimationDirection.RightToLeft,
    ],
    defaultValue: AnimationDirection.RightToLeft,
  },
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 2000,
  },
};
