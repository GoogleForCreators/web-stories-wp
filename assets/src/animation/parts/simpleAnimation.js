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
import { AnimationOutput, WithAnimation } from '../outputs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';
import createKeyframeEffect from '../utils/createKeyframeEffect';
import { WAAPIAnimationProps, AMPAnimationProps } from './types';
import FullSizeAbsolute from './components/fullSizeAbsolute';

const sanitizeTimings = (timings) => ({
  ...timings,
  easing: timings.easing || 'linear',
});

function SimpleAnimation(
  animationName,
  keyframes,
  timings,
  useClippingContainer,
  targetLeafElement = false
) {
  const id = uuidv4();

  const WAAPIAnimation = function ({ children, hoistAnimation }) {
    const target = useRef(null);

    useEffect(() => {
      const targetEl = targetLeafElement
        ? target.current?.querySelector('[data-leaf-element="true"]')
        : target.current;
      if (!targetEl) {
        return () => {};
      }
      const effect = createKeyframeEffect(
        targetEl,
        keyframes,
        sanitizeTimings(timings)
      );
      return hoistAnimation(new Animation(effect, document.timeline));
    }, [hoistAnimation]);

    return useClippingContainer ? (
      <FullSizeAbsolute overflowHidden={useClippingContainer}>
        <FullSizeAbsolute ref={target}>{children}</FullSizeAbsolute>
      </FullSizeAbsolute>
    ) : (
      <FullSizeAbsolute ref={target}>{children}</FullSizeAbsolute>
    );
  };

  WAAPIAnimation.propTypes = WAAPIAnimationProps;

  const AMPTarget = function ({ children, style = {} }) {
    const initialStylesFromKeyframes = targetLeafElement
      ? {}
      : getInitialStyleFromKeyframes(keyframes);
    const options = useClippingContainer
      ? {
          useClippingContainer: useClippingContainer,
          style,
          animationStyle: initialStylesFromKeyframes,
        }
      : {
          style: {
            ...style,
            ...initialStylesFromKeyframes,
          },
        };

    return (
      <WithAnimation id={`anim-${id}`} {...options}>
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
