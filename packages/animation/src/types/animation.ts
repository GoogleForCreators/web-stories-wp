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
  EffectBackgroundZoomAndPan = 'effect-background-pan-and-zoom',
  EffectBackgroundZoom = 'effect-background-zoom',
}

const {
  EffectBackgroundPan,
  EffectBackgroundZoomAndPan,
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

// Renamed this to StoryAnimation to avoid a clash with the imported Animation
// interface from `@types/web-animations-js` that we cannot rename due to how
// we have to import it at the top of this file.
export interface StoryAnimation {
  id: string;
  type: AnimationType;
  targets: string[];
  duration: number;

  panDir?: AnimationDirection;
  scale?: number;
  iterations?: number;
  delay?: number;
  zoomDirection?: ZoomDirection;
  whooshInDir?: AnimationDirection;
  scaleDirection?: ZoomDirection;
  flyInDir?: AnimationDirection;
}
