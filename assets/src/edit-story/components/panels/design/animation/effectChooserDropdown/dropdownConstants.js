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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  ANIMATION_EFFECTS,
  BACKGROUND_ANIMATION_EFFECTS,
  DIRECTION,
  SCALE_DIRECTION,
} from '../../../../../../animation';
import {
  DropAnimation,
  FadeInAnimation,
  FlyInLeftAnimation,
  FlyInRightAnimation,
  FlyInTopAnimation,
  FlyInBottomAnimation,
  PulseAnimation,
  RotateInLeftAnimation,
  RotateInRightAnimation,
  TwirlInAnimation,
  WhooshInLeftAnimation,
  WhooshInRightAnimation,
  ZoomInAnimation,
  ZoomOutAnimation,
  PanTopAnimation,
  PanRightAnimation,
  PanBottomAnimation,
  PanLeftAnimation,
  PanAndZoomAnimation,
} from './effectChooserElements';

export const getDirectionalEffect = (effect, direction) => {
  if (effectValueExceptions.includes(effect)) {
    return effect;
  }
  return direction ? `${effect} ${direction}`.trim() : effect;
};

export const NO_ANIMATION = 'none';

export const DYNAMIC_PROPERTY_VALUE = 'dynamicPropertyValue';

/**
 * GRID_SIZING is used for how to present effect options visually in dropDown
 */
export const GRID_SIZING = {
  HALF: 'half',
  QUARTER: 'quarter',
};

/**
 * Effects that are behind feature flag
 */
export const experimentalEffects = [];

/**
 * Some effects are more complicated or have just 1 prebaked option in the effect drop down.
 * For these we want to make sure we're mapping the appropriate value to the drop down selectedValue
 * which means ignoring direction which `getDirectionalEffect` ties into to give 1 effect several
 * options in the drop down.
 */
export const effectValueExceptions = [
  BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value,
];

/**
 * backgroundEffectOptions and foregroundEffectOptions are the structure used to generate
 * options for the animation effect menu dynamically.
 * Each option's key is the value that the dropdown will respect as the selectedValue.
 * Inside of each grouping is nested `animation` object
 * which specifies ariaLabel, animation options, true animation name (since some duplicate),
 * the keyframes Element for rendering the animation internal to the dropdown,
 * as well as UI specifications like how much of the grid the item should take up inside the menu
 * and what size font.
 * Everything that is dependent on circumstances - like if the animation is
 * disabled or if there's a tooltip or if the animation is hidden by an experiment
 * is set within the component itself.
 */

export const backgroundEffectOptions = {
  NO_ANIMATION: {
    value: NO_ANIMATION,
    label: __('None', 'web-stories'),
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    DIRECTION.LEFT_TO_RIGHT
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      DIRECTION.LEFT_TO_RIGHT
    ),
    label: __('Pan Left', 'web-stories'),
    animation: {
      ariaLabel: __('Pan Left Effect', 'web-stories'),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: DIRECTION.LEFT_TO_RIGHT,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanLeftAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    DIRECTION.RIGHT_TO_LEFT
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      DIRECTION.RIGHT_TO_LEFT
    ),
    label: __('Pan Right', 'web-stories'),
    animation: {
      ariaLabel: __('Pan Right Effect', 'web-stories'),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: DIRECTION.RIGHT_TO_LEFT,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanRightAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    DIRECTION.BOTTOM_TO_TOP
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      DIRECTION.BOTTOM_TO_TOP
    ),
    label: __('Pan Up', 'web-stories'),
    animation: {
      ariaLabel: __('Pan Up Effect', 'web-stories'),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: DIRECTION.BOTTOM_TO_TOP,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanBottomAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    DIRECTION.TOP_TO_BOTTOM
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      DIRECTION.TOP_TO_BOTTOM
    ),
    label: __('Pan Down', 'web-stories'),
    animation: {
      ariaLabel: __('Pan Down Effect', 'web-stories'),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: DIRECTION.TOP_TO_BOTTOM,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanTopAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
    SCALE_DIRECTION.SCALE_IN
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      SCALE_DIRECTION.SCALE_IN
    ),
    label: __('Zoom In', 'web-stories'),
    animation: {
      ariaLabel: __('Zoom In Effect', 'web-stories'),
      value: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      zoomDirection: SCALE_DIRECTION.SCALE_IN,
      gridSpace: GRID_SIZING.HALF,
      Effect: ZoomInAnimation,
      size: 14,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
    SCALE_DIRECTION.SCALE_OUT
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      SCALE_DIRECTION.SCALE_OUT
    ),
    label: __('Zoom Out', 'web-stories'),
    animation: {
      ariaLabel: __('Zoom Out Effect', 'web-stories'),
      value: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      zoomDirection: SCALE_DIRECTION.SCALE_OUT,
      gridSpace: GRID_SIZING.HALF,
      Effect: ZoomOutAnimation,
      size: 20,
    },
  },
  [BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value]: {
    value: BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value,
    label: __('Pan and Zoom', 'web-stories'),
    animation: {
      ariaLabel: __('Pan and Zoom Effect', 'web-stories'),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value,
      zoomDirection: DYNAMIC_PROPERTY_VALUE,
      Effect: PanAndZoomAnimation,
      size: 26,
    },
  },
};

export const foregroundEffectOptions = {
  NO_ANIMATION: {
    value: NO_ANIMATION,
    label: __('None', 'web-stories'),
  },
  [ANIMATION_EFFECTS.DROP.value]: {
    value: ANIMATION_EFFECTS.DROP.value,
    label: __('Drop', 'web-stories'),
    animation: {
      ariaLabel: __('Drop Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.DROP.value,
      Effect: DropAnimation,
    },
  },
  [ANIMATION_EFFECTS.FADE_IN.value]: {
    value: ANIMATION_EFFECTS.FADE_IN.value,
    label: __('Fade In', 'web-stories'),
    animation: {
      ariaLabel: __('Fade In Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.FADE_IN.value,
      Effect: FadeInAnimation,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    DIRECTION.LEFT_TO_RIGHT
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      DIRECTION.LEFT_TO_RIGHT
    ),
    label: __('Fly In', 'web-stories'),
    animation: {
      ariaLabel: __('Fly In from Left Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: DIRECTION.LEFT_TO_RIGHT,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInLeftAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    DIRECTION.TOP_TO_BOTTOM
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      DIRECTION.TOP_TO_BOTTOM
    ),
    label: __('Fly In', 'web-stories'),
    animation: {
      ariaLabel: __('Fly In from Top Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: DIRECTION.TOP_TO_BOTTOM,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInTopAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    DIRECTION.BOTTOM_TO_TOP
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      DIRECTION.BOTTOM_TO_TOP
    ),
    label: __('Fly In', 'web-stories'),
    animation: {
      ariaLabel: __('Fly In from Bottom Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: DIRECTION.BOTTOM_TO_TOP,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInBottomAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    DIRECTION.RIGHT_TO_LEFT
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      DIRECTION.RIGHT_TO_LEFT
    ),
    label: __('Fly In', 'web-stories'),
    animation: {
      ariaLabel: __('Fly In from Right Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: DIRECTION.RIGHT_TO_LEFT,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInRightAnimation,
      size: 16,
    },
  },
  [ANIMATION_EFFECTS.PULSE.value]: {
    value: ANIMATION_EFFECTS.PULSE.value,
    label: __('Pulse', 'web-stories'),
    animation: {
      ariaLabel: __('Pulse Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.PULSE.value,
      Effect: PulseAnimation,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.ROTATE_IN.value,
    DIRECTION.LEFT_TO_RIGHT
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.ROTATE_IN.value,
      DIRECTION.LEFT_TO_RIGHT
    ),
    label: __('Rotate', 'web-stories'),
    animation: {
      ariaLabel: __('Rotate In From Left Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.ROTATE_IN.value,
      rotateInDirection: DIRECTION.LEFT_TO_RIGHT,
      gridSpace: GRID_SIZING.HALF,
      Effect: RotateInLeftAnimation,
      size: 18,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.ROTATE_IN.value,
    DIRECTION.RIGHT_TO_LEFT
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.ROTATE_IN.value,
      DIRECTION.RIGHT_TO_LEFT
    ),
    label: __('Rotate', 'web-stories'),
    animation: {
      ariaLabel: __('Rotate In From Right Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.ROTATE_IN.value,
      rotateInDirection: DIRECTION.RIGHT_TO_LEFT,
      gridSpace: GRID_SIZING.HALF,
      Effect: RotateInRightAnimation,
      size: 18,
    },
  },
  [ANIMATION_EFFECTS.TWIRL_IN.value]: {
    value: ANIMATION_EFFECTS.TWIRL_IN.value,
    label: __('Twirl In', 'web-stories'),
    animation: {
      ariaLabel: __('Twirl In Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.TWIRL_IN.value,
      Effect: TwirlInAnimation,
      size: 26,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.WHOOSH_IN.value,
    DIRECTION.LEFT_TO_RIGHT
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.WHOOSH_IN.value,
      DIRECTION.LEFT_TO_RIGHT
    ),
    label: __('Whoosh In', 'web-stories'),
    animation: {
      ariaLabel: __('Whoosh In From Left Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.WHOOSH_IN.value,
      whooshInDirection: DIRECTION.LEFT_TO_RIGHT,
      gridSpace: GRID_SIZING.HALF,
      Effect: WhooshInLeftAnimation,
      size: 20,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.WHOOSH_IN.value,
    DIRECTION.RIGHT_TO_LEFT
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.WHOOSH_IN.value,
      DIRECTION.RIGHT_TO_LEFT
    ),
    label: __('Whoosh In', 'web-stories'),
    animation: {
      ariaLabel: __('Whoosh In From Right Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.WHOOSH_IN.value,
      whooshInDirection: DIRECTION.RIGHT_TO_LEFT,
      gridSpace: GRID_SIZING.HALF,
      Effect: WhooshInRightAnimation,
      size: 20,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.ZOOM.value,
    SCALE_DIRECTION.SCALE_IN
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.ZOOM.value,
      SCALE_DIRECTION.SCALE_IN
    ),
    label: __('Scale In', 'web-stories'),
    animation: {
      ariaLabel: __('Scale In Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.ZOOM.value,
      scaleDirection: SCALE_DIRECTION.SCALE_IN,
      gridSpace: GRID_SIZING.HALF,
      Effect: ZoomInAnimation,
      size: 14,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.ZOOM.value,
    SCALE_DIRECTION.SCALE_OUT
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.ZOOM.value,
      SCALE_DIRECTION.SCALE_OUT
    ),
    label: __('Scale Out', 'web-stories'),
    animation: {
      ariaLabel: __('Scale Out Effect', 'web-stories'),
      value: ANIMATION_EFFECTS.ZOOM.value,
      scaleDirection: SCALE_DIRECTION.SCALE_OUT,
      gridSpace: GRID_SIZING.HALF,
      Effect: ZoomOutAnimation,
      size: 20,
    },
  },
};
