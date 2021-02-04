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
import {
  ANIMATION_TYPES,
  ANIMATION_EFFECTS,
  BACKGROUND_ANIMATION_EFFECTS,
  BEZIER,
} from '../constants';
import getDefaultFieldValue from '../utils/getDefaultFieldValue';
import { EffectDrop } from '../effects/drop';
import { EffectFadeIn } from '../effects/fadeIn';
import { EffectFlyIn } from '../effects/flyIn';
import { EffectPan } from '../effects/pan';
import { EffectPulse } from '../effects/pulse';
import { EffectTwirlIn } from '../effects/twirlIn';
import { EffectWhooshIn } from '../effects/whooshIn';
import { EffectZoom } from '../effects/zoom';
import { EffectRotateIn } from '../effects/rotateIn';
import { EffectBackgroundZoom } from '../effects/backgroundZoom';
import { EffectBackgroundPan } from '../effects/backgroundPan';
import fadeInProps from '../effects/fadeIn/animationProps';
import flyInProps from '../effects/flyIn/animationProps';
import panProps from '../effects/pan/animationProps';
import pulseProps from '../effects/pulse/animationProps';
import rotateInProps from '../effects/rotateIn/animationProps';
import whooshInProps from '../effects/whooshIn/animationProps';
import zoomEffectProps from '../effects/zoom/animationProps';
import dropEffectProps from '../effects/drop/animationProps';
import backgroundZoomEffectProps from '../effects/backgroundZoom/animationProps';
import backgroundPanEffectProps from '../effects/backgroundPan/animationProps';

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

import defaultAnimationProps, {
  basicAnimationProps,
} from './defaultAnimationProps';
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
      [ANIMATION_EFFECTS.FADE_IN.value]: EffectFadeIn,
      [ANIMATION_EFFECTS.FLY_IN.value]: EffectFlyIn,
      [ANIMATION_EFFECTS.PAN.value]: EffectPan,
      [ANIMATION_EFFECTS.PULSE.value]: EffectPulse,
      [ANIMATION_EFFECTS.TWIRL_IN.value]: EffectTwirlIn,
      [ANIMATION_EFFECTS.WHOOSH_IN.value]: EffectWhooshIn,
      [ANIMATION_EFFECTS.ZOOM.value]: EffectZoom,
      [ANIMATION_EFFECTS.DROP.value]: EffectDrop,
      [ANIMATION_EFFECTS.ROTATE_IN.value]: EffectRotateIn,
      [BACKGROUND_ANIMATION_EFFECTS.ZOOM.value]: EffectBackgroundZoom,
      [BACKGROUND_ANIMATION_EFFECTS.PAN.value]: EffectBackgroundPan,
    }[type?.value || type] || throughput;

  args.easing = args.easing || BEZIER[args.easingPreset];
  args.easingPreset = undefined;

  return generator(args);
}

export function getAnimationProps(type) {
  const customProps = {
    [ANIMATION_TYPES.BLINK_ON]: blinkOnProps,
    [ANIMATION_TYPES.FADE]: fadeProps,
    [ANIMATION_TYPES.FLIP]: flipProps,
    [ANIMATION_TYPES.FLOAT_ON]: floatOnProps,
    [ANIMATION_TYPES.MOVE]: moveProps,
    [ANIMATION_TYPES.SPIN]: spinProps,
    [ANIMATION_TYPES.ZOOM]: zoomProps,
    [ANIMATION_EFFECTS.FLY_IN.value]: flyInProps,
    [ANIMATION_EFFECTS.PAN.value]: panProps,
    [ANIMATION_EFFECTS.PULSE.value]: pulseProps,
    [ANIMATION_EFFECTS.ROTATE_IN.value]: rotateInProps,
    [ANIMATION_EFFECTS.WHOOSH_IN.value]: whooshInProps,
    [ANIMATION_EFFECTS.ZOOM.value]: zoomProps,
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

export function getAnimationEffectProps(type) {
  const customProps = {
    [ANIMATION_EFFECTS.FLY_IN.value]: flyInProps,
    [ANIMATION_EFFECTS.PAN.value]: panProps,
    [ANIMATION_EFFECTS.PULSE.value]: pulseProps,
    [ANIMATION_EFFECTS.ROTATE_IN.value]: rotateInProps,
    [ANIMATION_EFFECTS.FADE_IN.value]: fadeInProps,
    [ANIMATION_EFFECTS.WHOOSH_IN.value]: whooshInProps,
    [ANIMATION_EFFECTS.ZOOM.value]: zoomEffectProps,
    [ANIMATION_EFFECTS.DROP.value]: dropEffectProps,
    [BACKGROUND_ANIMATION_EFFECTS.ZOOM.value]: backgroundZoomEffectProps,
    [BACKGROUND_ANIMATION_EFFECTS.PAN.value]: backgroundPanEffectProps,
  };

  return {
    type,
    // This order is important.
    // We want custom props to appear above default props
    props: orderByKeys({
      obj: {
        ...basicAnimationProps,
        ...(customProps[type] || {}),
      },
      keys: Object.keys({
        ...(customProps[type] || {}),
        ...basicAnimationProps,
      }),
    }),
  };
}

export function getAnimationEffectDefaults(type) {
  const { props: effectProps } = getAnimationEffectProps(type);

  return Object.keys(effectProps).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        effectProps[key].defaultValue ??
        getDefaultFieldValue(effectProps[key].type),
    }),
    {}
  );
}

export * from './types';
