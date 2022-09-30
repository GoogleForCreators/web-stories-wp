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

export enum PatternTypeV0 {
  Solid = 'solid',
  Linear = 'linear',
  Radial = 'radial',
  Conic = 'conic',
}
type AbstractGradientV0 = {
  type: PatternTypeV0.Linear | PatternTypeV0.Radial | PatternTypeV0.Conic;
  stops: ColorStop[];
  alpha?: number;
};

export type ConicV0 = AbstractGradientV0 & {
  type: PatternTypeV0.Conic;
  rotation?: number;
};

export type GradientV0 = Linear | Radial | ConicV0;
export type PatternV0 = Solid | GradientV0;

export type Hex = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export enum PatternType {
  Solid = 'solid',
  Linear = 'linear',
  Radial = 'radial',
}

export type Solid = {
  type?: PatternType.Solid;
  color: Hex;
};

export type ColorStop = {
  color: Hex;
  position: number;
};

type AbstractGradient = {
  type: PatternType.Linear | PatternType.Radial;
  stops: ColorStop[];
  alpha?: number;
};

export type Linear = AbstractGradient & {
  type: PatternType.Linear;
  rotation?: number;
};

export type Radial = AbstractGradient & {
  type: PatternType.Radial;
  size?: {
    w: number;
    h: number;
  };
  center?: {
    x: number;
    y: number;
  };
  rotation?: number;
};

export type Gradient = Linear | Radial;
export type Pattern = Solid | Gradient;
