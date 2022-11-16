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
import { getElementOffsets } from '@googleforcreators/media';
import { sprintf, _x, __ } from '@googleforcreators/i18n';
import type { DimensionableElement } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import type { GenericAnimation } from '../outputs';
import SimpleAnimation from '../parts/createAnimation';
import { AnimationDirection, AnimationType, FieldType } from '../types';
import type { AnimationPart } from '../parts';

type EffectBackgroundPanProps = {
  panDir?: AnimationDirection;
  element: DimensionableElement;
} & GenericAnimation;

export function EffectBackgroundPan({
  panDir = AnimationDirection.RightToLeft,
  duration = 2000,
  delay,
  easing = 'cubic-bezier(.3,0,.55,1)',
  element,
}: EffectBackgroundPanProps): AnimationPart<{ transform: string[] }> {
  const timings: GenericAnimation = {
    fill: 'both',
    duration,
    delay,
    easing,
  };

  const animationName = `direction-${panDir}-${AnimationType.EffectBackgroundPan}`;

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

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    keyframes,
    timings,
    false,
    true
  );

  return {
    id,
    keyframes,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
    generatedKeyframes: {
      [animationName]: keyframes,
    },
  };
}

export const fields = {
  panDirection: {
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
