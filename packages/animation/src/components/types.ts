/*
 * Copyright 2021 Google LLC
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
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import type { AnimationPart } from '../parts';
import type {
  AMPEffectTiming,
  Element,
  ElementId,
  Keyframes,
  StoryAnimation,
} from '../types';

// We can't depend on the elements package, but we also don't actually need to.
// The only thing we need concerning elements is the fact, that they're an object
// with a string id, so this will suffice.

export type { ElementId };

export type ElementAnimationHoister = (
  elementAnimation: WAAPIElementAnimation
) => () => void;

export type AnimationHoister = (animation: Animation) => () => void;

export interface AnimationProviderState {
  state: {
    providerId: string;
    animationTargets: ElementId[];
  };
  actions: {
    getAnimationParts: (target: ElementId) => AnimationPart[];
    hoistWAAPIAnimation: ElementAnimationHoister;
    WAAPIAnimationMethods: {
      play: () => void;
      pause: () => void;
      setCurrentTime: (time: number | 'end') => void;
      reset: () => void;
    };
  };
}

export type AnimationProviderProps = PropsWithChildren<{
  animations: StoryAnimation[];
  elements?: Element[];
  onWAAPIFinish?: () => void;
  selectedElementIds?: string[];
}>;

export type StoryAnimationMap = Map<StoryAnimation['id'], StoryAnimation>;
export type ElementAnimationPartsMap = Map<ElementId, AnimationPart[]>;

export interface WAAPIElementAnimation {
  animation: Animation;
  elementId: ElementId;
}
export type WAAPIElementAnimationMap = Map<symbol, WAAPIElementAnimation>;
export type ElementMap = Map<ElementId, Element>;

export type WAAPIAnimationWrapperProps = PropsWithChildren<{
  keyframes: Keyframes;
  timings: AMPEffectTiming;
  hoistAnimation: AnimationHoister;
  targetLeafElement?: boolean;
}>;

export type WrapperProps = PropsWithChildren<{
  target: ElementId;
}>;

export enum AnimationMachineState {
  Idle = 'idle',
  Complete = 'complete',
}

export enum AnimationMachineTransition {
  Complete = 'complete',
  Reset = 'reset',
}
