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
import { v4 as uuidv4 } from 'uuid';
import type { CSSProperties, PropsWithChildren } from 'react';
import { _x, __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { AnimationMove } from '../simple/move';
import { AnimationFade } from '../simple/fade';
import { getOffPageOffset } from '../../utils';
import {
  type AMPEffectTiming,
  AnimationDirection,
  AnimationType,
  type Element,
  FieldType,
} from '../../types';
import type { AnimationPart } from '../types';

export interface FlyInEffect extends AMPEffectTiming {
  flyInDir?: AnimationDirection;
  type: AnimationType.EffectFlyIn;
}

export function EffectFlyIn(
  {
    flyInDir = AnimationDirection.TopToBottom,
    duration = 600,
    delay = 0,
    easing = 'cubic-bezier(0.2, 0.6, 0.0, 1)',
  }: FlyInEffect,
  element: Element
): AnimationPart {
  const id = uuidv4();
  const { offsetTop, offsetLeft, offsetRight, offsetBottom } =
    getOffPageOffset(element);

  const offsetLookup = {
    [AnimationDirection.TopToBottom]: {
      offsetY: `${offsetTop}%`,
    },
    [AnimationDirection.BottomToTop]: {
      offsetY: `${offsetBottom}%`,
    },
    [AnimationDirection.LeftToRight]: {
      offsetX: `${offsetLeft}%`,
    },
    [AnimationDirection.RightToLeft]: {
      offsetX: `${offsetRight}%`,
    },
  };

  const fade = AnimationFade({
    fadeFrom: 0,
    fadeTo: 1,
    duration: duration,
    delay,
    easing,
    type: AnimationType.Fade,
  });

  const move = AnimationMove(
    {
      ...offsetLookup[flyInDir],
      duration,
      delay,
      easing,
      type: AnimationType.Move,
    },
    element
  );

  const keyframes = {
    ...move.keyframes,
    ...fade.keyframes,
  };

  return {
    id,
    keyframes,
    WAAPIAnimation: {
      ...move.WAAPIAnimation,
      keyframes,
    },
    AMPTarget: function AMPTarget({
      children,
      style,
    }: PropsWithChildren<{ style?: CSSProperties }>) {
      return (
        <fade.AMPTarget style={style}>
          <move.AMPTarget style={style}>{children}</move.AMPTarget>
        </fade.AMPTarget>
      );
    },
    AMPAnimation: function AMPAnimation() {
      return (
        <>
          <fade.AMPAnimation />
          <move.AMPAnimation />
        </>
      );
    },
    generatedKeyframes: {
      ...fade.generatedKeyframes,
      ...move.generatedKeyframes,
    },
  };
}

export const fields = {
  flyInDir: {
    label: __('Direction', 'web-stories'),
    type: FieldType.DirectionPicker,
    values: [
      AnimationDirection.TopToBottom,
      AnimationDirection.BottomToTop,
      AnimationDirection.LeftToRight,
      AnimationDirection.RightToLeft,
    ],
    defaultValue: AnimationDirection.BottomToTop,
  },
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 600,
  },
};
