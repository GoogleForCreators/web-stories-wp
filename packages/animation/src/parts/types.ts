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
import type {
  CSSProperties,
  HTMLAttributes,
  PropsWithChildren,
  VoidFunctionComponent,
} from 'react';

/**
 * Internal dependencies
 */
import type { AMPEffectTiming, Keyframes } from '../types';

export type AMPAnimationProps = PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
  prefixId?: string;
}>;

export interface WAAPIAnimation {
  keyframes: Keyframes;
  timings: AMPEffectTiming;
  useClippingContainer?: boolean;
  targetLeafElement?: boolean;
}

// This generic seems weird, but is very important. It allows complex effects
// to reach into the keyframes of their constituent animation parts and
// recompose them into combined keyframes.
// See how e.g. RotateIn is able to compose the move and spin keyframes.
// This is only possible because the keyframes property of each part isn't
// generically types as Keyframes but as a specific simple object.
export interface AnimationPart<T extends Keyframes = Keyframes> {
  id: string;
  keyframes: T;
  WAAPIAnimation: WAAPIAnimation;
  AMPTarget: VoidFunctionComponent<PropsWithChildren<HTMLAttributes<Element>>>;
  AMPAnimation: VoidFunctionComponent<{ prefixId?: string }>;
  generatedKeyframes: Record<string, Keyframes>;
}
