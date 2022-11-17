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
import { __, _x, sprintf } from '@googleforcreators/i18n';
import {
  ANIMATION_EFFECTS,
  BACKGROUND_ANIMATION_EFFECTS,
  AnimationDirection,
  ScaleDirection,
} from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
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
    label: _x('None', 'animation effect', 'web-stories'),
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    AnimationDirection.LeftToRight
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      AnimationDirection.LeftToRight
    ),
    label: _x('Pan Left', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Pan Left', 'animation effect', 'web-stories')
      ),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: AnimationDirection.LeftToRight,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanLeftAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    AnimationDirection.RightToLeft
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      AnimationDirection.RightToLeft
    ),
    label: _x('Pan Right', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Pan Right', 'animation effect', 'web-stories')
      ),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: AnimationDirection.RightToLeft,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanRightAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    AnimationDirection.BottomToTop
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      AnimationDirection.BottomToTop
    ),
    label: _x('Pan Up', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Pan Up', 'animation effect', 'web-stories')
      ),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: AnimationDirection.BottomToTop,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanBottomAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.PAN.value,
    AnimationDirection.TopToBottom
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      AnimationDirection.TopToBottom
    ),
    label: _x('Pan Down', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Pan Down', 'animation effect', 'web-stories')
      ),
      value: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
      panDirection: AnimationDirection.TopToBottom,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: PanTopAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
    ScaleDirection.ScaleIn
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      ScaleDirection.ScaleIn
    ),
    label: _x('Zoom In', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Zoom In', 'animation effect', 'web-stories')
      ),
      value: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      zoomDirection: ScaleDirection.ScaleIn,
      gridSpace: GRID_SIZING.HALF,
      Effect: ZoomInAnimation,
      size: 14,
    },
  },
  [getDirectionalEffect(
    BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
    ScaleDirection.ScaleOut
  )]: {
    value: getDirectionalEffect(
      BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      ScaleDirection.ScaleOut
    ),
    label: _x('Zoom Out', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Zoom Out', 'animation effect', 'web-stories')
      ),
      value: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
      zoomDirection: ScaleDirection.ScaleOut,
      gridSpace: GRID_SIZING.HALF,
      Effect: ZoomOutAnimation,
      size: 20,
    },
  },
  [BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value]: {
    value: BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value,
    label: BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.name
      ),
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
    label: _x('None', 'animation effect', 'web-stories'),
  },
  [ANIMATION_EFFECTS.DROP.value]: {
    value: ANIMATION_EFFECTS.DROP.value,
    label: ANIMATION_EFFECTS.DROP.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        ANIMATION_EFFECTS.DROP.name
      ),
      value: ANIMATION_EFFECTS.DROP.value,
      Effect: DropAnimation,
    },
  },
  [ANIMATION_EFFECTS.FADE_IN.value]: {
    value: ANIMATION_EFFECTS.FADE_IN.value,
    label: ANIMATION_EFFECTS.FADE_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        ANIMATION_EFFECTS.FADE_IN.name
      ),
      value: ANIMATION_EFFECTS.FADE_IN.value,
      Effect: FadeInAnimation,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    AnimationDirection.LeftToRight
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      AnimationDirection.LeftToRight
    ),
    label: ANIMATION_EFFECTS.FLY_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Fly In from Left', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: AnimationDirection.LeftToRight,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInLeftAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    AnimationDirection.TopToBottom
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      AnimationDirection.TopToBottom
    ),
    label: ANIMATION_EFFECTS.FLY_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Fly In from Top', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: AnimationDirection.TopToBottom,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInTopAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    AnimationDirection.BottomToTop
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      AnimationDirection.BottomToTop
    ),
    label: ANIMATION_EFFECTS.FLY_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Fly In from Bottom', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: AnimationDirection.BottomToTop,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInBottomAnimation,
      size: 16,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.FLY_IN.value,
    AnimationDirection.RightToLeft
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.FLY_IN.value,
      AnimationDirection.RightToLeft
    ),
    label: ANIMATION_EFFECTS.FLY_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Fly In from Right', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDirection: AnimationDirection.RightToLeft,
      gridSpace: GRID_SIZING.QUARTER,
      Effect: FlyInRightAnimation,
      size: 16,
    },
  },
  [ANIMATION_EFFECTS.PULSE.value]: {
    value: ANIMATION_EFFECTS.PULSE.value,
    label: ANIMATION_EFFECTS.PULSE.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        ANIMATION_EFFECTS.PULSE.name
      ),
      value: ANIMATION_EFFECTS.PULSE.value,
      Effect: PulseAnimation,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.ROTATE_IN.value,
    AnimationDirection.LeftToRight
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.ROTATE_IN.value,
      AnimationDirection.LeftToRight
    ),
    label: _x('Rotate', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Rotate In from Left', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.ROTATE_IN.value,
      rotateInDirection: AnimationDirection.LeftToRight,
      gridSpace: GRID_SIZING.HALF,
      Effect: RotateInLeftAnimation,
      size: 18,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.ROTATE_IN.value,
    AnimationDirection.RightToLeft
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.ROTATE_IN.value,
      AnimationDirection.RightToLeft
    ),
    label: _x('Rotate', 'animation effect', 'web-stories'),
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Rotate In from Right', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.ROTATE_IN.value,
      rotateInDirection: AnimationDirection.RightToLeft,
      gridSpace: GRID_SIZING.HALF,
      Effect: RotateInRightAnimation,
      size: 18,
    },
  },
  [ANIMATION_EFFECTS.TWIRL_IN.value]: {
    value: ANIMATION_EFFECTS.TWIRL_IN.value,
    label: ANIMATION_EFFECTS.TWIRL_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        ANIMATION_EFFECTS.TWIRL_IN.name
      ),
      value: ANIMATION_EFFECTS.TWIRL_IN.value,
      Effect: TwirlInAnimation,
      size: 26,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.WHOOSH_IN.value,
    AnimationDirection.LeftToRight
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.WHOOSH_IN.value,
      AnimationDirection.LeftToRight
    ),
    label: ANIMATION_EFFECTS.WHOOSH_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Whoosh In from Left', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.WHOOSH_IN.value,
      whooshInDirection: AnimationDirection.LeftToRight,
      gridSpace: GRID_SIZING.HALF,
      Effect: WhooshInLeftAnimation,
      size: 20,
    },
  },
  [getDirectionalEffect(
    ANIMATION_EFFECTS.WHOOSH_IN.value,
    AnimationDirection.RightToLeft
  )]: {
    value: getDirectionalEffect(
      ANIMATION_EFFECTS.WHOOSH_IN.value,
      AnimationDirection.RightToLeft
    ),
    label: ANIMATION_EFFECTS.WHOOSH_IN.name,
    animation: {
      ariaLabel: sprintf(
        /* translators: %s: animation effect. */
        __('"%s" Effect', 'web-stories'),
        _x('Whoosh In from Right', 'animation effect', 'web-stories')
      ),
      value: ANIMATION_EFFECTS.WHOOSH_IN.value,
      whooshInDirection: AnimationDirection.RightToLeft,
      gridSpace: GRID_SIZING.HALF,
      Effect: WhooshInRightAnimation,
      size: 20,
    },
  },
  [getDirectionalEffect(ANIMATION_EFFECTS.ZOOM.value, ScaleDirection.ScaleIn)]:
    {
      value: getDirectionalEffect(
        ANIMATION_EFFECTS.ZOOM.value,
        ScaleDirection.ScaleIn
      ),
      label: _x('Scale In', 'animation effect', 'web-stories'),
      animation: {
        ariaLabel: sprintf(
          /* translators: %s: animation effect. */
          __('"%s" Effect', 'web-stories'),
          _x('Scale In', 'animation effect', 'web-stories')
        ),
        value: ANIMATION_EFFECTS.ZOOM.value,
        scaleDirection: ScaleDirection.ScaleIn,
        gridSpace: GRID_SIZING.HALF,
        Effect: ZoomInAnimation,
        size: 14,
      },
    },
  [getDirectionalEffect(ANIMATION_EFFECTS.ZOOM.value, ScaleDirection.ScaleOut)]:
    {
      value: getDirectionalEffect(
        ANIMATION_EFFECTS.ZOOM.value,
        ScaleDirection.ScaleOut
      ),
      label: __('Scale Out', 'web-stories'),
      animation: {
        ariaLabel: sprintf(
          /* translators: %s: animation effect. */
          __('"%s" Effect', 'web-stories'),
          _x('Scale Out', 'animation effect', 'web-stories')
        ),
        value: ANIMATION_EFFECTS.ZOOM.value,
        scaleDirection: ScaleDirection.ScaleOut,
        gridSpace: GRID_SIZING.HALF,
        Effect: ZoomOutAnimation,
        size: 20,
      },
    },
};
