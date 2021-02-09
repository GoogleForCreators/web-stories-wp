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
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const wrapperRotation = keyframes`
    100% { transform: rotate(360deg) }
`;

const circleRotation = keyframes`
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 100, 200;
      stroke-dashoffset: -15;
    }
    100% {
      stroke-dasharray: 100, 200;
      stroke-dashoffset: -125;
    }
`;

const Wrapper = styled.div.attrs({
  role: 'progressbar',
})`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  animation: ${wrapperRotation} 1.4s linear infinite;
`;

const StyledSpinner = styled.svg`
  display: block;
`;

const StyledCircle = styled.circle`
  animation: ${circleRotation} 1.4s ease-in-out infinite;
  stroke: ${({ theme }) => `${theme.DEPRECATED_THEME.colors.loading.primary}`};
`;

function CircularProgress({ size, thickness }) {
  return (
    <CSSTransition in appear={true} timeout={0}>
      <Wrapper size={size}>
        <StyledSpinner viewBox={`${size / 2} ${size / 2} ${size} ${size}`}>
          <StyledCircle
            cx={size}
            cy={size}
            r={(size - thickness) / 2}
            fill="none"
            strokeWidth={thickness}
            stroke="currentColor"
          />
        </StyledSpinner>
      </Wrapper>
    </CSSTransition>
  );
}

CircularProgress.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
};

CircularProgress.defaultProps = {
  size: 24,
  thickness: 2,
};

export default CircularProgress;
