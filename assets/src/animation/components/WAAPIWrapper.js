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
import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import useStoryAnimationContext from './useStoryAnimationContext';

function ComposableWrapper({ animationParts, hoistAnimation, children }) {
  const ComposedWrapper = useMemo(
    () =>
      animationParts.reduce(
        (Composable, animationPart) => {
          const { WAAPIAnimation } = animationPart;
          const Composed = function (props) {
            return (
              <Composable>
                <WAAPIAnimation hoistAnimation={hoistAnimation}>
                  {props.children}
                </WAAPIAnimation>
              </Composable>
            );
          };
          Composed.propTypes = { children: PropTypes.node };
          return Composed;
        },
        (props) => props.children
      ),
    [animationParts, hoistAnimation]
  );

  return <ComposedWrapper>{children}</ComposedWrapper>;
}

ComposableWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  animationParts: PropTypes.arrayOf(PropTypes.object),
  hoistAnimation: PropTypes.func.isRequired,
};

function WAAPIWrapper({ children, target }) {
  const {
    actions: { getAnimationParts, hoistWAAPIAnimation },
  } = useStoryAnimationContext();

  const hoistAnimation = useCallback(
    (animation) => hoistWAAPIAnimation({ animation, elementId: target }),
    [target, hoistWAAPIAnimation]
  );

  return (
    <ComposableWrapper
      animationParts={getAnimationParts(target)}
      hoistAnimation={hoistAnimation}
    >
      {children}
    </ComposableWrapper>
  );
}

WAAPIWrapper.propTypes = {
  children: PropTypes.node,
  target: PropTypes.string,
};

export default WAAPIWrapper;
