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
import { sprintf, _x, __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { AnimationZoom } from '../parts/zoom';
import { AnimationFade } from '../parts/fade';
import { FieldType, ScaleDirection } from '../types';
import type { GenericAnimation } from '../outputs';
import type { AnimationPart } from '../parts';

type EffectZoomProps = {
  scaleDirection?: ScaleDirection;
} & GenericAnimation;

export function EffectZoom({
  scaleDirection = ScaleDirection.ScaleIn,
  duration = 1000,
  delay = 0,
  easing = 'cubic-bezier(.3,0,.55,1)',
}: EffectZoomProps): AnimationPart {
  const id = uuidv4();

  const zoom = AnimationZoom({
    zoomFrom: scaleDirection === ScaleDirection.ScaleOut ? 3 : 1 / 3,
    zoomTo: 1,
    duration,
    delay,
    easing,
  });

  const fade = AnimationFade({
    fadeFrom: scaleDirection === ScaleDirection.ScaleOut ? 1 : 0,
    fadeTo: 1,
    duration: duration,
    delay,
    easing,
  });

  const keyframes = {
    transform: zoom.keyframes.transform,
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
        <fade.AMPTarget style={style}>
          <zoom.AMPTarget style={style}>{children}</zoom.AMPTarget>
        </fade.AMPTarget>
      );
    },
    AMPAnimation: function AMPAnimation() {
      return (
        <>
          <fade.AMPAnimation />
          <zoom.AMPAnimation />
        </>
      );
    },
    generatedKeyframes: {
      ...fade.generatedKeyframes,
      ...zoom.generatedKeyframes,
    },
  };
}

export const fields = {
  scaleDirection: {
    label: __('Direction', 'web-stories'),
    tooltip: sprintf(
      /* translators: 1: scaleIn. 2: scaleOut */
      __('Valid values are %1$s or %2$s', 'web-stories'),
      'scaleIn',
      'scaleOut'
    ),
    type: FieldType.DirectionPicker,
    values: [ScaleDirection.ScaleIn, ScaleDirection.ScaleOut],
    defaultValue: ScaleDirection.ScaleIn,
  },
  duration: {
    label: __('Duration', 'web-stories'),
    type: FieldType.Number,
    unit: _x('ms', 'Time in milliseconds', 'web-stories'),
    defaultValue: 2000,
  },
};
