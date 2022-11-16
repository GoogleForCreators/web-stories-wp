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
import type { VoidFunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { AnimationOutput, GenericAnimation, WithAnimation } from '../outputs';
import type { Keyframes } from '../types';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';
import type { AMPAnimationProps, WAAPIAnimation, AnimationPart } from './types';

export const sanitizeTimings = ({
  easing,
  duration,
  delay,
  ...other
}: GenericAnimation) => ({
  ...other,
  easing: easing || 'linear',
  duration: typeof duration === 'number' ? Math.max(duration, 0) : 0,
  delay: typeof delay === 'number' ? Math.max(delay, 0) : 0,
});

function createAnimation<T extends Keyframes>(
  keyframes: T,
  timings: GenericAnimation,
  useClippingContainer = false,
  targetLeafElement = false
): AnimationPart<T> {
  const id = `anim-${uuidv4()}`;

  const WAAPIAnimation: WAAPIAnimation = {
    timings: sanitizeTimings(timings),
    keyframes,
    targetLeafElement,
    useClippingContainer,
  };

  const animationStyle = targetLeafElement
    ? {}
    : getInitialStyleFromKeyframes(keyframes);

  const AMPTarget: VoidFunctionComponent<AMPAnimationProps> = function ({
    children,
    style = {},
  }) {
    return (
      <WithAnimation
        id={id}
        className="animation-wrapper"
        useClippingContainer={useClippingContainer}
        style={style}
        animationStyle={animationStyle}
      >
        {children}
      </WithAnimation>
    );
  };

  const selector = targetLeafElement
    ? `#${id} [data-leaf-element="true"]`
    : `#${id}`;

  const AMPAnimation: VoidFunctionComponent = function () {
    return <AnimationOutput config={{ selector, keyframes, ...timings }} />;
  };

  return {
    id,
    keyframes,
    generatedKeyframes: { [id]: keyframes },
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
  };
}

export default createAnimation;
