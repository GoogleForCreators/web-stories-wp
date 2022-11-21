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

/// <reference types="@types/web-animations-js" />

/**
 * Internal dependencies
 */
import type { BezierType } from '../constants';
import type { PanBackgroundEffect } from '../parts/effects/backgroundPan';
import type { PanAndZoomBackgroundEffect } from '../parts/effects/backgroundPanAndZoom';
import type { ZoomBackgroundEffect } from '../parts/effects/backgroundZoom';
import type { DropEffect } from '../parts/effects/drop';
import type { FadeInEffect } from '../parts/effects/fadeIn';
import type { FlyInEffect } from '../parts/effects/flyIn';
import type { PanEffect } from '../parts/effects/pan';
import type { PulseEffect } from '../parts/effects/pulse';
import type { RotateInEffect } from '../parts/effects/rotateIn';
import type { TwirlInEffect } from '../parts/effects/twirlIn';
import type { WhooshInEffect } from '../parts/effects/whooshIn';
import type { ZoomEffect } from '../parts/effects/zoom';
import type { BlinkOnAnimation } from '../parts/simple/blinkOn';
import type { BounceAnimation } from '../parts/simple/bounce';
import type { FadeAnimation } from '../parts/simple/fade';
import type { FlipAnimation } from '../parts/simple/flip';
import type { FloatOnAnimation } from '../parts/simple/floatOn';
import type { MoveAnimation } from '../parts/simple/move';
import type { PulseAnimation } from '../parts/simple/pulse';
import type { SpinAnimation } from '../parts/simple/spin';
import type { ZoomAnimation } from '../parts/simple/zoom';
import type { ElementId } from './element';

export enum AnimationType {
  BlinkOn = 'blinkOn',
  Bounce = 'bounce',
  Fade = 'fade',
  Flip = 'flip',
  FloatOn = 'floatOn',
  Move = 'move',
  Pulse = 'pulse',
  Spin = 'spin',
  Zoom = 'zoom',

  EffectDrop = 'effect-drop',
  EffectFadeIn = 'effect-fade-in',
  EffectFlyIn = 'effect-fly-in',
  EffectPan = 'effect-pan',
  EffectPulse = 'effect-pulse',
  EffectRotateIn = 'effect-rotate-in',
  EffectTwirlIn = 'effect-twirl-in',
  EffectWhooshIn = 'effect-whoosh-in',
  EffectZoom = 'effect-zoom',

  EffectBackgroundPan = 'effect-background-pan',
  EffectBackgroundPanAndZoom = 'effect-background-pan-and-zoom',
  EffectBackgroundZoom = 'effect-background-zoom',
}

const {
  EffectBackgroundPan,
  EffectBackgroundPanAndZoom,
  EffectBackgroundZoom,
  ...NonBackgroundAnimationType
} = { ...AnimationType };
export { NonBackgroundAnimationType };

export type ZoomDirection =
  | 'dynamicPropertyValue'
  | 'scaleIn'
  | 'scaleInBottomRight'
  | 'scaleInTopLeft'
  | 'scaleOut'
  | 'scaleOutTopRight'
  | 'scaleOutBottomLeft';

export enum AnimationDirection {
  LeftToRight = 'leftToRight',
  TopToBottom = 'topToBottom',
  RightToLeft = 'rightToLeft',
  BottomToTop = 'bottomToTop',
}

export type AnimationInput =
  | PanAndZoomBackgroundEffect
  | PanBackgroundEffect
  | ZoomBackgroundEffect
  | DropEffect
  | FadeInEffect
  | FlyInEffect
  | PanEffect
  | PulseEffect
  | RotateInEffect
  | TwirlInEffect
  | WhooshInEffect
  | ZoomEffect
  | BlinkOnAnimation
  | BounceAnimation
  | FadeAnimation
  | FlipAnimation
  | FloatOnAnimation
  | MoveAnimation
  | PulseAnimation
  | SpinAnimation
  | ZoomAnimation;

export type AnimationInputWithPreset = AnimationInput & {
  easingPreset?: BezierType;
};

// Renamed this to StoryAnimation to avoid a clash with the imported Animation
// interface from `@types/web-animations-js` that we cannot rename due to how
// we have to import it at the top of this file.
export type StoryAnimation = AnimationInputWithPreset & {
  id: string;
  targets: ElementId[];
};
