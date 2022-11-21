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
import type { PanBackgroundEffect } from '../effects/backgroundPan';
import type { PanAndZoomBackgroundEffect } from '../effects/backgroundPanAndZoom';
import type { ZoomBackgroundEffect } from '../effects/backgroundZoom';
import type { DropEffect } from '../effects/drop';
import type { FadeInEffect } from '../effects/fadeIn';
import type { FlyInEffect } from '../effects/flyIn';
import type { PanEffect } from '../effects/pan';
import type { PulseEffect } from '../effects/pulse';
import type { RotateInEffect } from '../effects/rotateIn';
import type { TwirlInEffect } from '../effects/twirlIn';
import type { WhooshInEffect } from '../effects/whooshIn';
import type { ZoomEffect } from '../effects/zoom';
import type { BlinkOnAnimation } from '../parts/blinkOn';
import type { BounceAnimation } from '../parts/bounce';
import type { FadeAnimation } from '../parts/fade';
import type { FlipAnimation } from '../parts/flip';
import type { FloatOnAnimation } from '../parts/floatOn';
import type { MoveAnimation } from '../parts/move';
import type { PulseAnimation } from '../parts/pulse';
import type { SpinAnimation } from '../parts/spin';
import type { ZoomAnimation } from '../parts/zoom';
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
