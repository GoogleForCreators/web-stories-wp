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
import { useMemo } from '@googleforcreators/react';
import type { FunctionComponent, PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import type { AnimationPart } from '../parts';
import type { WrapperProps } from './types';
import useStoryAnimationContext from './useStoryAnimationContext';

const fullSizeAbsoluteStyles = {
  width: '100%',
  height: '100%',
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
} as const;

type ComposableWrapperProps = PropsWithChildren<{
  animationParts: AnimationPart[];
}>;

type Composed = PropsWithChildren<unknown>;

function ComposableWrapper({
  animationParts,
  children,
}: ComposableWrapperProps) {
  const root: FunctionComponent = (props: Composed) =>
    props.children as React.ReactElement;
  const ComposedWrapper = useMemo(
    () =>
      animationParts.reduce<FunctionComponent>(
        (Composable: FunctionComponent, animationPart: AnimationPart) => {
          const { AMPTarget } = animationPart;
          const Composed = (props: Composed) => {
            return (
              <Composable>
                <AMPTarget style={fullSizeAbsoluteStyles}>
                  {props.children}
                </AMPTarget>
              </Composable>
            );
          };
          return Composed;
        },
        root
      ),
    [animationParts]
  );

  // eslint-disable-next-line react-hooks/static-components -- FIXME
  return <ComposedWrapper>{children}</ComposedWrapper>;
}
function AMPWrapper({ target, children }: WrapperProps) {
  const {
    actions: { getAnimationParts },
  } = useStoryAnimationContext();

  return (
    <ComposableWrapper animationParts={getAnimationParts(target)}>
      {children}
    </ComposableWrapper>
  );
}

export default AMPWrapper;
