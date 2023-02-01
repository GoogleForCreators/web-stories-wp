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
import type { CSSProperties, PropsWithChildren } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import type { AnimationPart } from '../types';
import { AnimationFade } from '../simple/fade';
import { AnimationMove } from '../simple/move';
import { AnimationZoom } from '../simple/zoom';
import {
  type AMPEffectTiming,
  AnimationDirection,
  AnimationType,
  type Element,
  FieldType,
} from '../../types';
import getOffPageOffset from '../../utils/getOffPageOffset';

export interface WhooshInEffect extends AMPEffectTiming {
  whooshInDir?: AnimationDirection;
  type: AnimationType.EffectWhooshIn;
}

export function EffectWhooshIn(
  {
    whooshInDir = AnimationDirection.LeftToRight,
    duration = 600,
    easing = 'cubic-bezier(0.4, 0.4, 0.0, 1)',
    delay,
  }: WhooshInEffect,
  element: Element
): AnimationPart {
  const id = uuidv4();

  const { offsetLeft, offsetRight } = getOffPageOffset(element);

  const offsetX =
    whooshInDir === AnimationDirection.RightToLeft
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

  const fade = AnimationFade({
    fadeFrom: 0,
    fadeTo: 1,
    duration,
    delay,
    easing,
    type: AnimationType.Fade,
  });

  const zoom = AnimationZoom({
    zoomFrom: 0.15,
    zoomTo: 1,
    duration,
    delay,
    easing,
    type: AnimationType.Zoom,
  });

  const [moveTransformStart, moveTransformEnd] = move.keyframes.transform;
  const [zoomTransformStart, zoomTransformEnd] = zoom.keyframes.transform;
  const keyframes = {
    transform: [
      `${moveTransformStart} ${zoomTransformStart}`,
      `${moveTransformEnd} ${zoomTransformEnd}`,
    ],
    opacity: fade.keyframes.opacity,
  };

  return {
    id,
    keyframes,
    WAAPIAnimation: {
      ...zoom.WAAPIAnimation,
      keyframes,
    },
    AMPTarget: function AMPTarget({
      children,
      style,
    }: PropsWithChildren<{ style?: CSSProperties }>) {
      return (
        <move.AMPTarget style={style}>
          <fade.AMPTarget style={style}>
            <zoom.AMPTarget style={style}>{children}</zoom.AMPTarget>
          </fade.AMPTarget>
        </move.AMPTarget>
      );
    },
    AMPAnimation: function AMPAnimation() {
      return (
        <>
          <move.AMPAnimation />
          <fade.AMPAnimation />
          <zoom.AMPAnimation />
        </>
      );
    },
    generatedKeyframes: {
      ...move.generatedKeyframes,
      ...fade.generatedKeyframes,
      ...zoom.generatedKeyframes,
    },
  };
}

export const fields = {
  whooshInDir: {
    label: __('Direction', 'web-stories'),
    type: FieldType.DirectionPicker,
    values: [AnimationDirection.LeftToRight, AnimationDirection.RightToLeft],
    defaultValue: AnimationDirection.LeftToRight,
  },
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 600,
  },
};
