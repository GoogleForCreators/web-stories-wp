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
import { useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { AnimatorOutput, WithAnimation } from '../../outputs';
import getInitialStyleFromKeyframes from '../../utils/getInitialStyleFromKeyframes';
import { WAAPIAnimationProps, AMPAnimationProps } from '../types';
import FullSizeAbsolute from './fullSizeAbsolute';

function SimpleAnimation(animationName, keyframes, timings) {
  const id = uuidv4();

  const WAAPIAnimation = function ({ children, hoistAnimation }) {
    const target = useRef(null);

    useEffect(() => {
      if (!target.current) {
        return () => {};
      }
      const effect = new KeyframeEffect(target.current, keyframes, timings);
      return hoistAnimation(new Animation(effect, document.timeline));
    }, [hoistAnimation]);

    return <FullSizeAbsolute ref={target}>{children}</FullSizeAbsolute>;
  };

  WAAPIAnimation.propTypes = WAAPIAnimationProps;

  const AMPAnimation = function ({ children, style }) {
    return (
      <WithAnimation
        id={`anim-${id}`}
        style={{
          ...style,
          ...getInitialStyleFromKeyframes(keyframes),
        }}
      >
        {children}
      </WithAnimation>
    );
  };

  AMPAnimation.propTypes = AMPAnimationProps;

  const AMPAnimator = function ({ prefixId }) {
    return (
      <AnimatorOutput
        animation={`${prefixId}-${animationName}`}
        config={{ selector: `#anim-${id}`, ...timings }}
      />
    );
  };

  AMPAnimator.propTypes = AMPAnimationProps;

  return {
    id,
    WAAPIAnimation,
    AMPAnimation,
    AMPAnimator,
  };
}

export default SimpleAnimation;
