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
import PropTypes from 'prop-types';
import { useMemo } from '@googleforcreators/react';
import styled, { keyframes } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { themeHelpers, BEZIER } from '../../theme';

export const LOADING_MESSAGE = __('Loading', 'web-stories');

const ANIMATION_DURATION = 0.85;
const TAU = Math.PI * 2;

const getAngleOfCircle = (index, numCircles) => {
  return (TAU * index) / numCircles;
};

const getCirclePosition = (angle, animationSize) => {
  const radius = animationSize / 2;
  const x = Math.sin(angle) * radius;
  const y = -Math.cos(angle) * radius;

  return { x: x.toFixed(1), y: y.toFixed(1) };
};

const AriaOnlyAlert = styled.span(themeHelpers.visuallyHidden);

const Container = styled.div`
  position: relative;
  height: ${({ animationSize }) => animationSize}px;
  width: ${({ animationSize }) => animationSize}px;
  color: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
`;

const Circle = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
    ${({ $position: { x, y } }) => `translate(${x}px, ${y}px)`};

  height: ${({ circleSize }) => circleSize}px;
  width: ${({ circleSize }) => circleSize}px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
  border-radius: ${({ theme }) => theme.borders.radius.round};

  animation-name: ${({ circleIndex, numCircles }) => keyframes`
    0% {
      opacity: 1
    }
    ${`${(circleIndex * 100) / numCircles}%`} {
      opacity: 1
    }
    ${`${((circleIndex + 1) * 100) / numCircles}%`} {
      opacity: 0.3
    }
    ${`${((circleIndex + 1) * 100) / numCircles + 1}%`} {
      opacity: 1
    }
  `};
  animation-fill-mode: both;
  animation-duration: ${ANIMATION_DURATION}s;
  animation-iteration-count: infinite;
  animation-timing-function: ${BEZIER.easeInOutQuad};
`;

export function LoadingSpinner({
  animationSize = 95,
  circleSize = 12,
  loadingMessage = LOADING_MESSAGE,
  numCircles = 11,
  ...props
}) {
  const ids = useMemo(
    () => new Array(numCircles).fill(1).map(() => uuidv4()),
    [numCircles]
  );

  return (
    <Container animationSize={animationSize} {...props}>
      {loadingMessage && (
        <AriaOnlyAlert role="status">{loadingMessage}</AriaOnlyAlert>
      )}
      {ids.map((id, index) => {
        const angle = getAngleOfCircle(index, numCircles);
        const position = getCirclePosition(angle, animationSize);

        return (
          <Circle
            key={id}
            circleIndex={index}
            circleSize={circleSize}
            numCircles={numCircles}
            $position={position}
          />
        );
      })}
    </Container>
  );
}
LoadingSpinner.propTypes = {
  animationSize: PropTypes.number,
  circleSize: PropTypes.number,
  loadingMessage: PropTypes.string,
  numCircles: PropTypes.number,
};
