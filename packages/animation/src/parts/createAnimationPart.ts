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
import { BEZIER } from '../constants';
import {
  AnimationInput,
  AnimationInputWithPreset,
  AnimationType,
  Element,
} from '../types';
import { orderByKeys } from '../utils';
import getDefaultFieldValue from '../utils/getDefaultFieldValue';
import { EffectDrop, fields as dropFields } from './effects/drop';
import { EffectFadeIn, fields as fadeFields } from './effects/fadeIn';
import { EffectFlyIn, fields as flyInFields } from './effects/flyIn';
import { EffectPan, fields as panFields } from './effects/pan';
import { EffectPulse, fields as pulseFields } from './effects/pulse';
import { EffectTwirlIn } from './effects/twirlIn';
import { EffectWhooshIn, fields as whooshInFields } from './effects/whooshIn';
import { EffectZoom, fields as zoomFields } from './effects/zoom';
import { EffectRotateIn, fields as rotateInFields } from './effects/rotateIn';
import {
  EffectBackgroundZoom,
  fields as bgZoomFields,
} from './effects/backgroundZoom';
import {
  EffectBackgroundPan,
  fields as bgPanFields,
} from './effects/backgroundPan';
import {
  EffectBackgroundPanAndZoom,
  fields as bgPanZoomFields,
} from './effects/backgroundPanAndZoom';

import { AnimationBounce } from './simple/bounce';
import { AnimationBlinkOn } from './simple/blinkOn';
import { AnimationFade } from './simple/fade';
import { AnimationFlip } from './simple/flip';
import { AnimationFloatOn } from './simple/floatOn';
import { AnimationMove } from './simple/move';
import { AnimationPulse } from './simple/pulse';
import { AnimationSpin } from './simple/spin';
import { AnimationZoom } from './simple/zoom';

import { basicAnimationFields } from './defaultFields';
import type { AnimationPart } from './types';
import emptyAnimationPart from './emptyAnimationPart';

function convertEasingPreset({
  easingPreset,
  easing,
  ...rest
}: AnimationInputWithPreset): AnimationInput {
  return {
    ...rest,
    easing: easing ? easing : easingPreset ? BEZIER[easingPreset] : undefined,
  };
}

// eslint-disable-next-line complexity -- Just a large switch
function createAnimationPart(
  animationWithPreset: AnimationInputWithPreset,
  element: Element
): AnimationPart {
  const animation = convertEasingPreset(animationWithPreset);

  switch (animation.type) {
    case AnimationType.BlinkOn:
      return AnimationBlinkOn(animation);
    case AnimationType.Bounce:
      return AnimationBounce(animation);
    case AnimationType.Fade:
      return AnimationFade(animation);
    case AnimationType.Flip:
      return AnimationFlip(animation);
    case AnimationType.FloatOn:
      return AnimationFloatOn(animation);
    case AnimationType.Move:
      return AnimationMove(animation, element);
    case AnimationType.Pulse:
      return AnimationPulse(animation);
    case AnimationType.Spin:
      return AnimationSpin(animation, element);
    case AnimationType.Zoom:
      return AnimationZoom(animation);
    case AnimationType.EffectDrop:
      return EffectDrop(animation, element);
    case AnimationType.EffectFadeIn:
      return EffectFadeIn(animation);
    case AnimationType.EffectFlyIn:
      return EffectFlyIn(animation, element);
    case AnimationType.EffectPan:
      return EffectPan(animation, element);
    case AnimationType.EffectPulse:
      return EffectPulse(animation);
    case AnimationType.EffectRotateIn:
      return EffectRotateIn(animation, element);
    case AnimationType.EffectTwirlIn:
      return EffectTwirlIn(animation, element);
    case AnimationType.EffectWhooshIn:
      return EffectWhooshIn(animation, element);
    case AnimationType.EffectZoom:
      return EffectZoom(animation);
    case AnimationType.EffectBackgroundPan:
      return EffectBackgroundPan(animation, element);
    case AnimationType.EffectBackgroundPanAndZoom:
      return EffectBackgroundPanAndZoom(animation, element);
    case AnimationType.EffectBackgroundZoom:
      return EffectBackgroundZoom(animation, element);
    default:
      return emptyAnimationPart();
  }
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
    [AnimationType.EffectBackgroundPanAndZoom]: bgPanZoomFields,
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
    type === AnimationType.EffectBackgroundPanAndZoom &&
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

export default createAnimationPart;
