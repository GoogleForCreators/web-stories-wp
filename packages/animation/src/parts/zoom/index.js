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
import { ANIMATION_TYPES } from '../../constants';
import SimpleAnimation from '../simpleAnimation';

const defaults = {
  fill: 'forwards',
  duration: 1000,
};

export function AnimationZoom({
  zoomFrom = 0,
  zoomTo = 1,
  targetLeafElement = false,
  transformOrigin,
  ...args
}) {
  const timings = {
    ...defaults,
    ...args,
  };

  const animationName = `from-${zoomFrom}-to-${zoomTo}-${ANIMATION_TYPES.ZOOM}`;
  const keyframes = {
    transform: [`scale(${zoomFrom})`, `scale(${zoomTo})`],
  };

  // If supplied a transformOrigin, AMP doesn't allow us to set
  // the transformOrigin property from the keyframes since it is
  // an unanimatable property. To account for this we calculate a
  // counter translate based off the scale change that mimicks the
  // element scaling from a particular origin.
  if (transformOrigin) {
    // transformOrigin default is `50% 50%` so we account for
    // that here in our calculations.
    const originRelativeToCenter = {
      x: 50 - transformOrigin.horizontal,
      y: 50 - transformOrigin.vertical,
    };
    const counterScaleTranslate = {
      x: (zoomFrom - 1) * originRelativeToCenter.x,
      y: (zoomFrom - 1) * originRelativeToCenter.y,
    };
    keyframes.transform = [
      `translate(${counterScaleTranslate.x}%, ${counterScaleTranslate.y}%) ${keyframes.transform[0]}`,
      `translate(0%, 0%) ${keyframes.transform[1]}`,
    ];
  }

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    animationName,
    keyframes,
    timings,
    false,
    targetLeafElement
  );

  return {
    id,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
    generatedKeyframes: {
      [animationName]: keyframes,
    },
  };
}
