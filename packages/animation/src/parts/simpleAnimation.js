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
import { AnimationOutput, WithAnimation } from '../outputs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';
import { AMPAnimationProps } from './types';

export const sanitizeTimings = ({ easing, duration, delay, ...other }) => ({
  ...other,
  easing: easing || 'linear',
  duration: !isNaN(Number(duration)) ? Math.max(duration, 0) : 0,
  delay: !isNaN(Number(delay)) ? Math.max(delay, 0) : 0,
});

function SimpleAnimation(
  animationName,
  keyframes,
  timings,
  useClippingContainer,
  targetLeafElement = false
) {
  const id = uuidv4();

  const WAAPIAnimation = {
    timings: sanitizeTimings(timings),
    keyframes,
    targetLeafElement,
    useClippingContainer,
  };

  const AMPTarget = function ({ children, style = {} }) {
    const animationStyle = targetLeafElement
      ? {}
      : getInitialStyleFromKeyframes(keyframes);
    const options = useClippingContainer
      ? {
          useClippingContainer: useClippingContainer,
          style,
          animationStyle,
        }
      : {
          style: {
            ...style,
            ...animationStyle,
          },
        };

    return (
      <WithAnimation
        id={`anim-${id}`}
        className="animation-wrapper"
        {...options}
      >
        {children}
      </WithAnimation>
    );
  };

  AMPTarget.propTypes = AMPAnimationProps;

  const AMPAnimation = function () {
    const selector = targetLeafElement
      ? `#anim-${id} [data-leaf-element="true"]`
      : `#anim-${id}`;
    return <AnimationOutput config={{ selector, keyframes, ...timings }} />;
  };

  AMPAnimation.propTypes = AMPAnimationProps;

  return {
    id,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
  };
}

export default SimpleAnimation;
