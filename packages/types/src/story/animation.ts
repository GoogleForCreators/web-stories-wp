/*
 * Copyright 2022 Google LLC
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

export type AnimationType =
  | 'blinkOn'
  | 'bounce'
  | 'effect-background-pan'
  | 'effect-background-pan-and-zoom'
  | 'effect-background-zoom'
  | 'effect-drop'
  | 'effect-fade-in'
  | 'effect-fly-in'
  | 'effect-pan'
  | 'effect-pulse'
  | 'effect-rotate-in'
  | 'effect-twirl-in'
  | 'effect-whoosh-in'
  | 'effect-zoom'
  | 'fade'
  | 'flip'
  | 'floatOn'
  | 'move'
  | 'pulse'
  | 'spin'
  | 'zoom';

export type ZoomDirection =
  | 'dynamicPropertyValue'
  | 'scaleIn'
  | 'scaleInBottomRight'
  | 'scaleInTopLeft'
  | 'scaleOut'
  | 'scaleOutTopRight'
  | 'scaleOutBottomLeft';

export type AnimationDirection =
  | 'leftToRight'
  | 'topToBottom'
  | 'rightToLeft'
  | 'bottomToTop';

export interface Animation {
  id: string;
  type: AnimationType;
  targets: string[];
  panDir?: AnimationDirection;
  scale?: number;
  iterations?: number;
  duration: number;
  delay: number;
  zoomDirection?: ZoomDirection;
  whooshInDir?: AnimationDirection;
  scaleDirection?: ZoomDirection;
  flyInDir?: AnimationDirection;
}
