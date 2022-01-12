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
 * Internal dependencies
 */
import { BREAKPOINTS } from './breakpoints';
import * as TYPOGRAPHY from './typography';

const ICON_SIZE = 32;
const LARGE_BUTTON_SIZE = 56;

export const THEME_CONSTANTS = {
  BREAKPOINTS,
  TYPOGRAPHY,
  ICON_SIZE,
  LARGE_BUTTON_SIZE,
};

export const BEZIER = {
  linear: 'linear',
  inQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  outQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  inOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  inCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  outCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  inOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  inQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  outQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  inOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  inQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  outQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  inSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  outSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  inOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  inExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  inOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  inCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  outCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  inOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
  default: 'cubic-bezier(0.4, 0.4, 0.0, 1)',
};
