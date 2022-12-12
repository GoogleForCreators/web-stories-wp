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
import { useCallback, useRef, useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import createKeyframeEffect from '../utils/createKeyframeEffect';
import FullSizeAbsolute from './fullSizeAbsolute';
import type { WAAPIAnimationWrapperProps, WrapperProps } from './types';
import useStoryAnimationContext from './useStoryAnimationContext';

function WAAPIAnimationWrapper({
  children,
  hoistAnimation,
  keyframes,
  timings,
  targetLeafElement = false,
}: WAAPIAnimationWrapperProps) {
  const target = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!keyframes) {
      return () => undefined;
    }

    const targetEl = targetLeafElement
      ? target.current?.querySelector('[data-leaf-element="true"]')
      : target.current;

    if (!targetEl) {
      return () => undefined;
    }
    const effect = createKeyframeEffect(targetEl, keyframes, timings);
    return hoistAnimation(new Animation(effect, document.timeline));
  }, [hoistAnimation, keyframes, targetLeafElement, timings]);

  return <FullSizeAbsolute ref={target}>{children}</FullSizeAbsolute>;
}

function WAAPIWrapper({ children, target }: WrapperProps) {
  const { hoistWAAPIAnimation, animationParts } = useStoryAnimationContext(
    ({ actions }) => ({
      hoistWAAPIAnimation: actions.hoistWAAPIAnimation,
      animationParts: actions.getAnimationParts(target),
    })
  );
  const WAAPIAnimationParts = animationParts?.map(
    (anim) => anim.WAAPIAnimation
  );

  const hoistAnimation = useCallback(
    (animation: Animation) =>
      hoistWAAPIAnimation({ animation, elementId: target }),
    [target, hoistWAAPIAnimation]
  );

  // Parents/Wrappers need to stay consistent here and only have prop changes
  // to allow react's reconcilliation algorithm to function properly
  // and not generate a new subtree of DOM nodes:
  // https://github.com/facebook/react/issues/3965
  //
  // To Accomodate for this, we're setting a max of 3 levels deep. All stories built recently should
  // only have 1 animation per element, however this allows for backward compatibility with old stories
  // created from legacy templates that use stacked animation parts on single elements
  return (
    <WAAPIAnimationWrapper
      hoistAnimation={hoistAnimation}
      {...WAAPIAnimationParts[0]}
    >
      <WAAPIAnimationWrapper
        hoistAnimation={hoistAnimation}
        {...WAAPIAnimationParts[1]}
      >
        <WAAPIAnimationWrapper
          hoistAnimation={hoistAnimation}
          {...WAAPIAnimationParts[2]}
        >
          {children}
        </WAAPIAnimationWrapper>
      </WAAPIAnimationWrapper>
    </WAAPIAnimationWrapper>
  );
}

export default WAAPIWrapper;
