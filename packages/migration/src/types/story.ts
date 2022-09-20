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

/* The types in StoryV0 do not reflect the exact state as the Story actually was at that point.
 The types are accurate for the properties that have been migrated
 but since the types were added only later then we don't how the story exactly was at that point.
 For example FontMetrics, Resource, and GifElement did not exist at StoryV0.
 */

/**
 * Internal dependencies
 */
import type { ElementV0 } from './element';

export interface Group {
  name: string;
  isLocked: boolean;
  isCollapsed?: boolean;
}

type AnimationTypeV0 =
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

type AnimationZoomDirectionV0 =
  | 'dynamicPropertyValue'
  | 'scaleIn'
  | 'scaleInBottomRight'
  | 'scaleInTopLeft'
  | 'scaleOut'
  | 'scaleOutTopRight'
  | 'scaleOutBottomLeft';

type AnimationPanDirectionV0 =
  | 'leftToRight'
  | 'topToBottom'
  | 'rightToLeft'
  | 'bottomToTop';

interface AnimationV0 {
  id: string;
  type: AnimationTypeV0;
  target: string;
  panDir?: AnimationPanDirectionV0;
  duration: number;
  delay: number;
  zoomDirection?: AnimationZoomDirectionV0;
}

export type Groups = Record<string, Group>;

export interface PageV0 {
  elements: ElementV0[];
  animations?: AnimationV0[];
  type: 'page';
  groups: Groups;
  backgroundAudio?: {
    src: string;
    id: number;
    mimeType: string;
  };
}
export interface StoryV0 {
  [i: number]: PageV0;
}
