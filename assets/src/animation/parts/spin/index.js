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
import { defaultUnit, getGlobalSpace } from '../../utils';
import SimpleAnimation from '../simpleAnimation';

const defaults = {
  fill: 'forwards',
  duration: 1000,
};

export function AnimationSpin({
  rotation = 0,
  stopAngle = 0,
  element,
  ...args
}) {
  const global = getGlobalSpace(element);
  const timings = {
    ...defaults,
    ...args,
  };

  const animationName = `rot-${rotation}-${ANIMATION_TYPES.SPIN}`;
  const keyframes = [
    { transform: global`rotateZ(${defaultUnit(rotation, 'deg')})` },
    { transform: global`rotateZ(${defaultUnit(stopAngle, 'deg')})` },
  ];

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
