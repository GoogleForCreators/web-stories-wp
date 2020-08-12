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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ANIMATION_TYPES, ANIMATION_EFFECTS, BEZIER } from '../constants';
import { EffectDrop } from '../effects/drop';
import { EffectFadeIn } from '../effects/fadeIn';
import { EffectFlyIn } from '../effects/flyIn';
import { EffectPan } from '../effects/pan';
import { EffectPulse } from '../effects/pulse';
import { EffectTwirlIn } from '../effects/twirlIn';
import { EffectWhooshIn } from '../effects/whooshIn';
import { EffectZoom } from '../effects/zoom';
import { EffectRotateIn } from '../effects/rotateIn';
import flyInProps from '../effects/flyIn/animationProps';
import panProps from '../effects/pan/animationProps';
import pulseProps from '../effects/pulse/animationProps';
import whooshInProps from '../effects/whooshIn/animationProps';

import { AnimationBounce } from './bounce';
import { AnimationBlinkOn } from './blinkOn';
import { AnimationFade } from './fade';
import { AnimationFlip } from './flip';
import { AnimationFloatOn } from './floatOn';
import { AnimationMove } from './move';
import { AnimationPulse } from './pulse';
import { AnimationSpin } from './spin';
import { AnimationZoom } from './zoom';

import defaultAnimationProps from './defaultAnimationProps';
import blinkOnProps from './blinkOn/animationProps';
import fadeProps from './fade/animationProps';
import flipProps from './flip/animationProps';
import floatOnProps from './floatOn/animationProps';
import moveProps from './move/animationProps';
import spinProps from './spin/animationProps';
import zoomProps from './zoom/animationProps';

function EmptyAMPTarget({ children, ...rest }) {
  return <div {...rest}>{children}</div>;
}

EmptyAMPTarget.propTypes = {
  children: PropTypes.node,
};

export function throughput() {
  return {
    id: -1,
    generatedKeyframes: {},
    WAAPIAnimation: ({ children }) => children,
    AMPTarget: EmptyAMPTarget,
    AMPAnimation: () => null,
  };
}

export function AnimationPart(type, args) {
  const generator =
    {
      [ANIMATION_TYPES.BOUNCE]: AnimationBounce,
      [ANIMATION_TYPES.BLINK_ON]: AnimationBlinkOn,
      [ANIMATION_TYPES.FADE]: AnimationFade,
      [ANIMATION_TYPES.FLIP]: AnimationFlip,
      [ANIMATION_TYPES.FLOAT_ON]: AnimationFloatOn,
      [ANIMATION_TYPES.MOVE]: AnimationMove,
      [ANIMATION_TYPES.PULSE]: AnimationPulse,
      [ANIMATION_TYPES.SPIN]: AnimationSpin,
      [ANIMATION_TYPES.ZOOM]: AnimationZoom,
      [ANIMATION_EFFECTS.FADE_IN]: EffectFadeIn,
      [ANIMATION_EFFECTS.FLY_IN]: EffectFlyIn,
      [ANIMATION_EFFECTS.PAN]: EffectPan,
      [ANIMATION_EFFECTS.PULSE]: EffectPulse,
      [ANIMATION_EFFECTS.TWIRL_IN]: EffectTwirlIn,
      [ANIMATION_EFFECTS.WHOOSH_IN]: EffectWhooshIn,
      [ANIMATION_EFFECTS.ZOOM]: EffectZoom,
      [ANIMATION_EFFECTS.DROP]: EffectDrop,
      [ANIMATION_EFFECTS.ROTATE_IN]: EffectRotateIn,
    }[type] || throughput;

  args.easing = args.easing || BEZIER[args.easingPreset];
  args.easingPreset = undefined;

  return generator(args);
}

export function AnimationProps(type) {
  const customProps = {
    [ANIMATION_TYPES.BLINK_ON]: blinkOnProps,
    [ANIMATION_TYPES.FADE]: fadeProps,
    [ANIMATION_TYPES.FLIP]: flipProps,
    [ANIMATION_TYPES.FLOAT_ON]: floatOnProps,
    [ANIMATION_TYPES.MOVE]: moveProps,
    [ANIMATION_TYPES.SPIN]: spinProps,
    [ANIMATION_TYPES.ZOOM]: zoomProps,
    [ANIMATION_EFFECTS.FLY_IN]: flyInProps,
    [ANIMATION_EFFECTS.PAN]: panProps,
    [ANIMATION_EFFECTS.PULSE]: pulseProps,
    [ANIMATION_EFFECTS.WHOOSH_IN]: whooshInProps,
  };

  const { type: animationType, ...remaining } = defaultAnimationProps;

  return {
    type,
    props: {
      // This order is important.
      // Type first, then custom props, then defaults.
      type: animationType,
      ...(customProps[type] || {}),
      ...remaining,
    },
  };
}
