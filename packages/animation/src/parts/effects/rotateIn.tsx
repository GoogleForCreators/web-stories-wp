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
import { __ } from '@googleforcreators/i18n';
import type { CSSProperties, PropsWithChildren } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import type { AnimationPart } from '../types';
import { AnimationMove } from '../simple/move';
import { AnimationSpin } from '../simple/spin';
import {
  type AMPEffectTiming,
  AnimationDirection,
  AnimationType,
  type Element,
  FieldType,
} from '../../types';
import { getOffPageOffset } from '../../utils';

const numberOfRotations = 1;
const stopAngle = 0;

export interface RotateInEffect extends AMPEffectTiming {
  rotateInDir?: AnimationDirection;
  type: AnimationType.EffectRotateIn;
}

export function EffectRotateIn(
  {
    rotateInDir = AnimationDirection.LeftToRight,
    duration = 1000,
    easing = 'cubic-bezier(.2, 0, .8, 1)',
    delay,
  }: RotateInEffect,
  element: Element
): AnimationPart {
  const id = uuidv4();

  const { offsetLeft, offsetRight } = getOffPageOffset(element);

  const offsetX =
    rotateInDir === AnimationDirection.RightToLeft
      ? `${offsetRight}%`
      : `${offsetLeft}%`;

  const move = AnimationMove(
    {
      offsetX,
      duration,
      delay,
      easing,
      type: AnimationType.Move,
    },
    element
  );

  const spin = AnimationSpin(
    {
      rotation: `${
        (rotateInDir === AnimationDirection.LeftToRight ? -1 : 1) *
        180 *
        numberOfRotations
      }`,
      stopAngle,
      duration,
      delay,
      easing: 'cubic-bezier(.2, 0, .5, 1)',
      type: AnimationType.Spin,
    },
    element
  );

  const [moveTransformStart, moveTransformEnd] = move.keyframes.transform;
  const [spinTransformStart, spinTransformEnd] = spin.keyframes.transform;
  const keyframes = {
    transform: [
      `${moveTransformStart} ${spinTransformStart}`,
      `${moveTransformEnd} ${spinTransformEnd}`,
    ],
  };

  return {
    id,
    keyframes,
    WAAPIAnimation: {
      ...spin.WAAPIAnimation,
      keyframes,
    },
    AMPTarget: function AMPTarget({
      children,
      style,
    }: PropsWithChildren<{ style?: CSSProperties }>) {
      return (
        <move.AMPTarget style={style}>
          <spin.AMPTarget style={style}>{children}</spin.AMPTarget>
        </move.AMPTarget>
      );
    },
    AMPAnimation: function AMPAnimation() {
      return (
        <>
          <move.AMPAnimation />
          <spin.AMPAnimation />
        </>
      );
    },
    generatedKeyframes: {
      ...move.generatedKeyframes,
      ...spin.generatedKeyframes,
    },
  };
}

export const fields = {
  rotateInDir: {
    label: __('Direction', 'web-stories'),
    type: FieldType.DirectionPicker,
    values: [AnimationDirection.LeftToRight, AnimationDirection.RightToLeft],
    defaultValue: AnimationDirection.LeftToRight,
  },
};
