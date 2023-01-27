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

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  Quaternary = 'quaternary',
  Plain = 'plain',
}

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
}

export enum ButtonVariant {
  Circle = 'circle',
  Rectangle = 'rectangle',
  Square = 'square',
  Icon = 'icon',
  Link = 'link',
}

export const BUTTON_TRANSITION_TIMING = '0.3s ease 0s';
