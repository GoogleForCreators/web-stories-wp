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
import type { PropsWithChildren, HTMLAttributes } from 'react';

/**
 * Internal dependencies
 */
import { BEZIER, BezierType } from '../constants';
import { AnimationType } from '../types';
import type { GenericAnimation } from '../outputs';
import getDefaultFieldValue from '../utils/getDefaultFieldValue';
import { EffectDrop, fields as dropFields } from '../effects/drop';
import { EffectFadeIn, fields as fadeFields } from '../effects/fadeIn';
import { EffectFlyIn, fields as flyInFields } from '../effects/flyIn';
import { EffectPan, fields as panFields } from '../effects/pan';
import { EffectPulse, fields as pulseFields } from '../effects/pulse';
import { EffectTwirlIn } from '../effects/twirlIn';
import { EffectWhooshIn, fields as whooshInFields } from '../effects/whooshIn';
import { EffectZoom, fields as zoomFields } from '../effects/zoom';
import { EffectRotateIn, fields as rotateInFields } from '../effects/rotateIn';
import {
  EffectBackgroundZoom,
  fields as bgZoomFields,
} from '../effects/backgroundZoom';
import {
  EffectBackgroundPan,
  fields as bgPanFields,
} from '../effects/backgroundPan';
import {
  EffectBackgroundPanAndZoom,
  fields as bgPanZoomFields,
} from '../effects/backgroundPanAndZoom';

import { orderByKeys } from '../utils';
import { AnimationBounce } from './bounce';
import { AnimationBlinkOn } from './blinkOn';
import { AnimationFade } from './fade';
import { AnimationFlip } from './flip';
import { AnimationFloatOn } from './floatOn';
import { AnimationMove } from './move';
import { AnimationPulse } from './pulse';
import { AnimationSpin } from './spin';
import { AnimationZoom } from './zoom';

import { basicAnimationFields } from './defaultFields';
import type { AnimationPart } from './types';

function EmptyAMPTarget({
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div {...rest}>{children}</div>;
}

export function throughput(): AnimationPart {
  return {
    id: '-1',
    keyframes: {},
    generatedKeyframes: {},
    WAAPIAnimation: { keyframes: {}, timings: {} },
    AMPTarget: EmptyAMPTarget,
    AMPAnimation: () => null,
  };
}

export function createAnimationPart(
  type: AnimationType,
  args: GenericAnimation
): AnimationPart {
  const generator =
    {
      [AnimationType.Bounce]: AnimationBounce,
      [AnimationType.BlinkOn]: AnimationBlinkOn,
      [AnimationType.Fade]: AnimationFade,
      [AnimationType.Flip]: AnimationFlip,
      [AnimationType.FloatOn]: AnimationFloatOn,
      [AnimationType.Move]: AnimationMove,
      [AnimationType.Pulse]: AnimationPulse,
      [AnimationType.Spin]: AnimationSpin,
      [AnimationType.Zoom]: AnimationZoom,
      [AnimationType.EffectFadeIn]: EffectFadeIn,
      [AnimationType.EffectFlyIn]: EffectFlyIn,
      [AnimationType.EffectPan]: EffectPan,
      [AnimationType.EffectPulse]: EffectPulse,
      [AnimationType.EffectTwirlIn]: EffectTwirlIn,
      [AnimationType.EffectWhooshIn]: EffectWhooshIn,
      [AnimationType.EffectZoom]: EffectZoom,
      [AnimationType.EffectDrop]: EffectDrop,
      [AnimationType.EffectRotateIn]: EffectRotateIn,
      [AnimationType.EffectBackgroundZoom]: EffectBackgroundZoom,
      [AnimationType.EffectBackgroundPan]: EffectBackgroundPan,
      [AnimationType.EffectBackgroundZoomAndPan]: EffectBackgroundPanAndZoom,
    }[type] || throughput;

  args.easing =
    args.easing ||
    (args.easingPreset && args.easingPreset in BEZIER
      ? BEZIER[args.easingPreset as BezierType]
      : undefined);
  args.easingPreset = undefined;

  return generator(args);
}

export function getAnimationEffectFields(type?: AnimationType) {
  const customFieldsByType: Partial<Record<AnimationType, unknown>> = {
    [AnimationType.EffectFadeIn]: fadeFields,
    [AnimationType.EffectFlyIn]: flyInFields,
    [AnimationType.EffectPan]: panFields,
    [AnimationType.EffectPulse]: pulseFields,
    [AnimationType.EffectWhooshIn]: whooshInFields,
    [AnimationType.EffectZoom]: zoomFields,
    [AnimationType.EffectDrop]: dropFields,
    [AnimationType.EffectRotateIn]: rotateInFields,
    [AnimationType.EffectBackgroundZoom]: bgZoomFields,
    [AnimationType.EffectBackgroundPan]: bgPanFields,
    [AnimationType.EffectBackgroundZoomAndPan]: bgPanZoomFields,
  };

  const customFields = (type && customFieldsByType[type]) || {};
  const allFields = {
    ...basicAnimationFields,
    ...customFields,
  };
  const allFieldsOrder = {
    ...customFields,
    ...basicAnimationFields,
  };
  let fieldOrder = Object.keys(allFieldsOrder);

  // ZoomAndPand design deviates from the normal input order by putting
  // a custom field (zoom direction) at the end. This accomodates for that.
  const zoomField = 'zoomDirection';
  if (
    type === AnimationType.EffectBackgroundZoomAndPan &&
    fieldOrder.includes(zoomField)
  ) {
    fieldOrder = fieldOrder
      .filter((field) => field !== zoomField)
      .concat([zoomField]);
  }

  // This order is important.
  // We want custom fields to appear above default fields, but we
  // also want custom fields to override any same-named default fields
  const fields = orderByKeys(allFields, fieldOrder);
  return fields;
}

export function getAnimationEffectDefaults(type: AnimationType) {
  const fields = getAnimationEffectFields(type);
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      value.defaultValue ?? getDefaultFieldValue(value.type),
    ])
  );
}

export * from './types';
