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
import { EffectDrop } from './effects/drop';
import { EffectFadeIn } from './effects/fadeIn';
import { EffectFlyIn } from './effects/flyIn';
import { EffectPan } from './effects/pan';
import { EffectPulse } from './effects/pulse';
import { EffectTwirlIn } from './effects/twirlIn';
import { EffectWhooshIn } from './effects/whooshIn';
import { EffectZoom } from './effects/zoom';
import { EffectRotateIn } from './effects/rotateIn';
import { EffectBackgroundZoom } from './effects/backgroundZoom';
import { EffectBackgroundPan } from './effects/backgroundPan';
import { EffectBackgroundPanAndZoom } from './effects/backgroundPanAndZoom';

import { AnimationBounce } from './simple/bounce';
import { AnimationBlinkOn } from './simple/blinkOn';
import { AnimationFade } from './simple/fade';
import { AnimationFlip } from './simple/flip';
import { AnimationFloatOn } from './simple/floatOn';
import { AnimationMove } from './simple/move';
import { AnimationPulse } from './simple/pulse';
import { AnimationSpin } from './simple/spin';
import { AnimationZoom } from './simple/zoom';

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

export default createAnimationPart;
