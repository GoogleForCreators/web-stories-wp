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

export enum ScaleDirection {
  DynamicPropertyValue = 'dynamicPropertyValue',
  ScaleIn = 'scaleIn',
  ScaleOut = 'scaleOut',
  ScaleOutTopRight = 'scaleOutTopRight',
  ScaleOutBottomLeft = 'scaleOutBottomLeft',
  ScaleInTopLeft = 'scaleInTopLeft',
  ScaleInBottomRight = 'scaleInBottomRight',
}

export enum Rotation {
  Clockwise = 'clockwise',
  CounterClockwise = 'counterClockwise',
  PingPong = 'pingPong',
}

export enum Axis {
  X = 'x',
  Y = 'y',
}

export enum FieldType {
  Dropdown = 'dropdown',
  Hidden = 'hidden',
  RotationPicker = 'rotation_picker',
  DirectionPicker = 'direction_picker',
  Number = 'number',
  Float = 'float',
  Text = 'text',
  Checkbox = 'checkbox',
  Range = 'RANGE',
}

export interface AMPEffectTiming extends Omit<EffectTiming, 'iterations'> {
  iterations?: number | 'infinity';
}
