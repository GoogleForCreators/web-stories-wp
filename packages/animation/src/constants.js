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
import { _x } from '@googleforcreators/i18n';

export const BEZIER = {
  linear: 'linear',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
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

export const ANIMATION_TYPES = {
  BLINK_ON: 'blinkOn',
  BOUNCE: 'bounce',
  FADE: 'fade',
  FLIP: 'flip',
  FLOAT_ON: 'floatOn',
  MOVE: 'move',
  PULSE: 'pulse',
  SPIN: 'spin',
  ZOOM: 'zoom',
};

export const ANIMATION_EFFECTS = {
  DROP: {
    value: 'effect-drop',
    name: _x('Drop', 'animation effect', 'web-stories'),
  },
  FADE_IN: {
    value: 'effect-fade-in',
    name: _x('Fade In', 'animation effect', 'web-stories'),
  },
  FLY_IN: {
    value: 'effect-fly-in',
    name: _x('Fly In', 'animation effect', 'web-stories'),
  },
  PAN: {
    value: 'effect-pan',
    name: _x('Pan', 'animation effect', 'web-stories'),
  },
  PULSE: {
    value: 'effect-pulse',
    name: _x('Pulse', 'animation effect', 'web-stories'),
  },
  TWIRL_IN: {
    value: 'effect-twirl-in',
    name: _x('Twirl In', 'animation effect', 'web-stories'),
  },
  WHOOSH_IN: {
    value: 'effect-whoosh-in',
    name: _x('Whoosh In', 'animation effect', 'web-stories'),
  },
  ZOOM: {
    value: 'effect-zoom',
    name: _x('Scale', 'animation effect', 'web-stories'),
  },
  ROTATE_IN: {
    value: 'effect-rotate-in',
    name: _x('Rotate In', 'animation effect', 'web-stories'),
  },
};

export const BACKGROUND_ANIMATION_EFFECTS = {
  ZOOM: {
    value: 'effect-background-zoom',
    name: _x('Zoom', 'animation effect', 'web-stories'),
  },
  PAN: { value: 'effect-background-pan', name: ANIMATION_EFFECTS.PAN.name },
  PAN_AND_ZOOM: {
    value: 'effect-background-pan-and-zoom',
    name: _x('Pan and Zoom', 'animation effect', 'web-stories'),
  },
};

export const ANIMATION_PARTS = {
  BLINK_ON: {
    value: ANIMATION_TYPES.BLINK_ON,
    name: _x('Blink On', 'animation effect', 'web-stories'),
  },
  BOUNCE: {
    value: ANIMATION_TYPES.BOUNCE,
    name: _x('Bounce', 'animation effect', 'web-stories'),
  },
  FADE: {
    value: ANIMATION_TYPES.FADE,
    name: _x('Fade', 'animation effect', 'web-stories'),
  },
  FLIP: {
    value: ANIMATION_TYPES.FLIP,
    name: _x('Flip', 'animation effect', 'web-stories'),
  },
  FLOAT_ON: {
    value: ANIMATION_TYPES.FLOAT_ON,
    name: _x('Float On', 'animation effect', 'web-stories'),
  },
  MOVE: {
    value: ANIMATION_TYPES.MOVE,
    name: _x('Move', 'animation effect', 'web-stories'),
  },
  PULSE: {
    value: ANIMATION_TYPES.PULSE,
    name: _x('Pulse', 'animation effect', 'web-stories'),
  },
  SPIN: {
    value: ANIMATION_TYPES.SPIN,
    name: _x('Spin', 'animation effect', 'web-stories'),
  },
  ZOOM: {
    value: ANIMATION_TYPES.ZOOM,
    name: _x('Zoom', 'animation effect', 'web-stories'),
  },
};

export const DIRECTION = {
  TOP_TO_BOTTOM: 'topToBottom',
  RIGHT_TO_LEFT: 'rightToLeft',
  BOTTOM_TO_TOP: 'bottomToTop',
  LEFT_TO_RIGHT: 'leftToRight',
};

export const SCALE_DIRECTION = {
  DYNAMIC_PROPERTY_VALUE: 'dynamicPropertyValue',
  SCALE_IN: 'scaleIn',
  SCALE_OUT: 'scaleOut',
  SCALE_OUT_TOP_RIGHT: 'scaleOutTopRight',
  SCALE_OUT_BOTTOM_LEFT: 'scaleOutBottomLeft',
  SCALE_IN_TOP_LEFT: 'scaleInTopLeft',
  SCALE_IN_BOTTOM_RIGHT: 'scaleInBottomRight',
};

export const SCALE_DIRECTION_MAP = {
  SCALE_IN: [
    SCALE_DIRECTION.SCALE_IN_TOP_LEFT,
    SCALE_DIRECTION.SCALE_IN_BOTTOM_RIGHT,
  ],
  SCALE_OUT: [
    SCALE_DIRECTION.SCALE_OUT_TOP_RIGHT,
    SCALE_DIRECTION.SCALE_OUT_BOTTOM_LEFT,
  ],
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
  ROTATION_PICKER: 'rotation_picker',
  DIRECTION_PICKER: 'direction_picker',
  NUMBER: 'number',
  FLOAT: 'float',
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  RANGE: 'RANGE',
};

export const STORY_ANIMATION_STATE = {
  RESET: 'reset',
  PAUSED: 'paused',
  SCRUBBING: 'scrubbing',
  PLAYING: 'playing',
  PLAYING_SELECTED: 'playing-selected',
};

export const BG_MIN_SCALE = 100;
export const BG_MAX_SCALE = 400;
