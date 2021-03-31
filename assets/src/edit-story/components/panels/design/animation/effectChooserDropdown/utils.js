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
import {
  BACKGROUND_ANIMATION_EFFECTS,
  SCALE_DIRECTION,
} from '../../../../../../animation';
import {
  effectValueExceptions,
  DYNAMIC_PROPERTY_VALUE,
} from './dropdownConstants';

// Because some animations have the same effect name we have to specify based on direction
export const getDirectionalEffect = (effect, direction) => {
  return direction ? `${effect} ${direction}`.trim() : effect;
};

export const getDisabledBackgroundEffects = (
  backgroundEffectOptions,
  disabledTypeOptionsMap
) => {
  const disabledDirectionalEffects = Object.entries(disabledTypeOptionsMap)
    // rn we don't ever disable the exceptions, but do dynamic props instead.
    .filter(([effect]) => effectValueExceptions.indexOf(effect) === -1)
    .map(([effect, val]) => [effect, val.options])
    .reduce(
      (directionalEffects, [effect, directions]) => [
        ...directionalEffects,
        ...(directions || []).map((dir) => getDirectionalEffect(effect, dir)),
      ],
      []
    );
  return Object.keys(backgroundEffectOptions).filter((directionalEffect) =>
    disabledDirectionalEffects.includes(directionalEffect)
  );
};

export const hasDynamicProperty = (animation) => {
  return Object.values(animation).includes(DYNAMIC_PROPERTY_VALUE);
};

export const updateDynamicProps = ({ animation, disabledOptions = [] }) => {
  switch (animation.value) {
    case BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value:
      return {
        ...animation,
        // Defautl zoomDirection to scale in unless disabled
        zoomDirection: disabledOptions.includes(SCALE_DIRECTION.SCALE_IN)
          ? SCALE_DIRECTION.SCALE_OUT
          : SCALE_DIRECTION.SCALE_IN,
      };
    default:
      return animation;
  }
};

export const generateDynamicProps = ({ animation, disabledTypeOptionsMap }) => {
  return hasDynamicProperty(animation)
    ? updateDynamicProps({
        animation,
        disabledOptions: disabledTypeOptionsMap[animation.value]?.options,
      })
    : animation;
};
