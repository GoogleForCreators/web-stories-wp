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
import type { CSSProperties, PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import type { AMPEffectTiming, Keyframes } from '../types';

export interface AnimationConfig extends AMPEffectTiming {
  selector: string;
  animation?: string;
  keyframes?: Keyframes;
}

export interface AnimationOutputProps {
  config: AnimationConfig | AnimationConfig[];
}

export type WithAnimationProps = PropsWithChildren<{
  id?: string;
  className?: string;
  style?: CSSProperties;
  animationStyle?: CSSProperties;
  useClippingContainer?: boolean;
}>;

export interface KeyframesOutputProps extends AMPEffectTiming {
  id: string;
  keyframes: Keyframes;
}
