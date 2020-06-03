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
import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import useStoryAnimationContext from './useStoryAnimationContext';

function ComposableWrapper({ animationParts, children, style }) {
  const ComposedWrapper = useMemo(
    () =>
      animationParts.reduce(
        (Composable, animationPart) => {
          const { AMPTarget } = animationPart;
          const Composed = function (props) {
            return (
              <Composable>
                <AMPTarget style={style}>{props.children}</AMPTarget>
              </Composable>
            );
          };
          Composed.propTypes = { children: PropTypes.node };
          return Composed;
        },
        (props) => props.children
      ),
    [animationParts, style]
  );

  return <ComposedWrapper>{children}</ComposedWrapper>;
}

ComposableWrapper.propTypes = {
  animationParts: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

function AMPWrapper({ target, children, style }) {
  const {
    actions: { getAnimationParts },
  } = useStoryAnimationContext();

  return (
    <ComposableWrapper style={style} animationParts={getAnimationParts(target)}>
      {children}
    </ComposableWrapper>
  );
}

AMPWrapper.propTypes = {
  target: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
};

export default AMPWrapper;
