/*
 * Copyright 2021 Google LLC
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
import styled, { keyframes } from 'styled-components';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../animation/constants';

const CIRCLE_DIAMETER = 95;
const NUM_CIRCLES = 11;
const ANIMATION_DURATION = 2;

const TAU = Math.PI * 2;

const getAngleOfCircle = (index) => {
  return (TAU * index) / NUM_CIRCLES;
};

const getCirclePosition = (angle) => {
  const radius = CIRCLE_DIAMETER / 2;
  const x = Math.sin(angle) * radius;
  const y = -Math.cos(angle) * radius;

  return { x: x.toFixed(1), y: y.toFixed(1) };
};

const Container = styled.div`
  position: relative;
  height: ${CIRCLE_DIAMETER}px;
  width: ${CIRCLE_DIAMETER}px;
  color: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
`;

const Circle = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
    ${({ $position: { x, y } }) => `translate(${x}px, ${y}px)`};

  height: 12px;
  width: 12px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
  border-radius: ${({ theme }) => theme.borders.radius.round};

  animation-name: ${({ circleIndex }) => keyframes`
    0% {
      opacity: 1
    }
    ${`${(circleIndex * 100) / NUM_CIRCLES}%`} {
      opacity: 1
    }
    ${`${((circleIndex + 1) * 100) / NUM_CIRCLES}%`} {
      opacity: 0.3
    }
    ${`${((circleIndex + 1) * 100) / NUM_CIRCLES + 1}%`} {
      opacity: 1
    }
  `};
  animation-fill-mode: both;
  animation-duration: ${ANIMATION_DURATION}s;
  animation-iteration-count: infinite;
  animation-timing-function: ${BEZIER.easeInOutQuad};
`;

const numCircles = new Array(NUM_CIRCLES).fill(1);

export function LoadingSpinner(props) {
  return (
    <Container {...props}>
      {numCircles.map((_, index) => {
        return (
          <Circle
            key={index}
            circleIndex={index}
            $position={getCirclePosition(getAngleOfCircle(index))}
          />
        );
      })}
    </Container>
  );
}
