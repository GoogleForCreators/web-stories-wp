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
import { _x } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { AnimationType, ScaleDirection } from './types';

export const BEZIER = {
  linear: 'linear',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
  inQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  outQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  inOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  inCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  outCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  inOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  inQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  outQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  inOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  inQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  outQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  inSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  outSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  inOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  inExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  inOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  inCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  outCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  inOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
  default: 'cubic-bezier(0.4, 0.4, 0.0, 1)',
};

export type BezierType = keyof typeof BEZIER;

export const ANIMATION_EFFECTS = {
  DROP: {
    value: AnimationType.EffectDrop,
    name: _x('Drop', 'animation effect', 'web-stories'),
  },
  FADE_IN: {
    value: AnimationType.EffectFadeIn,
    name: _x('Fade In', 'animation effect', 'web-stories'),
  },
  FLY_IN: {
    value: AnimationType.EffectFlyIn,
    name: _x('Fly In', 'animation effect', 'web-stories'),
  },
  PAN: {
    value: AnimationType.EffectPan,
    name: _x('Pan', 'animation effect', 'web-stories'),
  },
  PULSE: {
    value: AnimationType.EffectPulse,
    name: _x('Pulse', 'animation effect', 'web-stories'),
  },
  TWIRL_IN: {
    value: AnimationType.EffectTwirlIn,
    name: _x('Twirl In', 'animation effect', 'web-stories'),
  },
  WHOOSH_IN: {
    value: AnimationType.EffectWhooshIn,
    name: _x('Whoosh In', 'animation effect', 'web-stories'),
  },
  ZOOM: {
    value: AnimationType.EffectZoom,
    name: _x('Scale', 'animation effect', 'web-stories'),
  },
  ROTATE_IN: {
    value: AnimationType.EffectRotateIn,
    name: _x('Rotate In', 'animation effect', 'web-stories'),
  },
};

export const BACKGROUND_ANIMATION_EFFECTS = {
  ZOOM: {
    value: AnimationType.EffectBackgroundZoom,
    name: _x('Zoom', 'animation effect', 'web-stories'),
  },
  PAN: {
    value: AnimationType.EffectBackgroundPan,
    name: ANIMATION_EFFECTS.PAN.name,
  },
  PAN_AND_ZOOM: {
    value: AnimationType.EffectBackgroundZoomAndPan,
    name: _x('Pan and Zoom', 'animation effect', 'web-stories'),
  },
};

export const ANIMATION_PARTS = {
  BLINK_ON: {
    value: AnimationType.BlinkOn,
    name: _x('Blink On', 'animation effect', 'web-stories'),
  },
  BOUNCE: {
    value: AnimationType.Bounce,
    name: _x('Bounce', 'animation effect', 'web-stories'),
  },
  FADE: {
    value: AnimationType.Fade,
    name: _x('Fade', 'animation effect', 'web-stories'),
  },
  FLIP: {
    value: AnimationType.Flip,
    name: _x('Flip', 'animation effect', 'web-stories'),
  },
  FLOAT_ON: {
    value: AnimationType.FloatOn,
    name: _x('Float On', 'animation effect', 'web-stories'),
  },
  MOVE: {
    value: AnimationType.Move,
    name: _x('Move', 'animation effect', 'web-stories'),
  },
  PULSE: {
    value: AnimationType.Pulse,
    name: _x('Pulse', 'animation effect', 'web-stories'),
  },
  SPIN: {
    value: AnimationType.Spin,
    name: _x('Spin', 'animation effect', 'web-stories'),
  },
  ZOOM: {
    value: AnimationType.Zoom,
    name: _x('Zoom', 'animation effect', 'web-stories'),
  },
};

export const SCALE_DIRECTIONS = {
  IN: [ScaleDirection.ScaleInTopLeft, ScaleDirection.ScaleInBottomRight],
  OUT: [ScaleDirection.ScaleOutTopRight, ScaleDirection.ScaleInBottomRight],
} as const;

export const BG_MIN_SCALE = 100;
export const BG_MAX_SCALE = 400;
