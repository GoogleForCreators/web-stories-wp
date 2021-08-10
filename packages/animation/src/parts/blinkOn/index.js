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
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { ANIMATION_TYPES } from '../../constants';
import SimpleAnimation from '../simpleAnimation';
import generateLookupMap from '../../utils/generateLookupMap';
import padArray from '../../utils/padArray';

export const DEFAULT_BLINKS = 10;

const AVAILABLE_OPACITY = [0, 0.25, 0.75, 1];

const defaults = {
  fill: 'forwards',
};

function generateOpacityFrames(count) {
  const blinkCount = count || DEFAULT_BLINKS;
  const opacityFrames = [];
  const lookup = generateLookupMap(AVAILABLE_OPACITY);

  for (let i = 0; i < blinkCount - 2; i++) {
    const opacities = i > 0 ? lookup[opacityFrames[i - 1]] : AVAILABLE_OPACITY;
    const opacity = opacities[Math.floor(Math.random() * opacities.length)];

    opacityFrames.push(opacity);
  }

  return [...padArray(opacityFrames, 3)];
}

export function AnimationBlinkOn({ blinkCount, ...args }) {
  const timings = {
    ...defaults,
    ...args,
  };

  const animationName = `${uuidv4()}-${ANIMATION_TYPES.BLINK_ON}`;
  const keyframes = {
    opacity: [0, ...generateOpacityFrames(blinkCount), 1],
  };

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    animationName,
    keyframes,
    timings
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
