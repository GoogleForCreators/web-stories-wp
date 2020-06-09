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

export { BEZIER } from '../constants';

export const ANIMATION_TYPES = {
  BLINK_ON: 'blinkOn',
  BOUNCE: 'bounce',
  FADE: 'fade',
  FLIP: 'flip',
  FLOAT_ON: 'floatOn',
  MOVE: 'move',
  SPIN: 'spin',
  ZOOM: 'zoom',
};

export const DIRECTION = {
  TOP_TO_BOTTOM: 'topToBottom',
  BOTTOM_TO_TOP: 'bottomToTop',
  LEFT_TO_RIGHT: 'leftToRight',
  RIGHT_TO_LEFT: 'rightToLeft',
};

export const ROTATION = {
  CLOCKWISE: 'clockwise',
  COUNTER_CLOCKWISE: 'counterClockwise',
  PING_PONG: 'pingPong',
};

export const AXIS = {
  X: 'x',
  Y: 'y',
};

export const FIELD_TYPES = {
  DROPDOWN: 'dropdown',
  HIDDEN: 'hidden',
  NUMBER: 'number',
  FLOAT: 'float',
  TEXT: 'text',
  CHECKBOX: 'checkbox',
};
