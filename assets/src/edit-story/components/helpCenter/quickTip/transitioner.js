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
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import { ScheduledTransition } from '../scheduledTransition';

const DURATION = 550;
const DELAY = 80;

const Opacity = styled.div``;

const enterStyles = () => css`
  transition-delay: ${DELAY / 1000}s;
  transform: none;
  ${Opacity} {
    opacity: 1;
  }
`;

const exitStyles = ({ isLeftToRightTransition }) => css`
  position: absolute;
  bottom: 0;

  ${Opacity} {
    opacity: 0;
  }

  ${isLeftToRightTransition
    ? css`
        transform: translateX(-100%);
      `
    : css`
        transform: translateX(100%);
      `}
`;

const transitionStyles = {
  entering: enterStyles,
  entered: enterStyles,
  exiting: exitStyles,
  exited: exitStyles,
};

const Manager = styled.div`
  position: relative;
  color: ${({ theme }) => theme.colors.fg.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  transition: ${DURATION / 1000}s transform ${BEZIER.default};
  transform-origin: 50% 50%;
  z-index: 2;
  ${({ isLeftToRightTransition }) =>
    isLeftToRightTransition
      ? css`
          transform: translateX(100%);
        `
      : css`
          transform: translateX(-100%);
        `}

  ${Opacity} {
    opacity: 0.6;
    transition: ${DURATION / 1000}s opacity ${BEZIER.default};
  }

  ${({ state, ...props }) => transitionStyles[state]?.(props)};
`;

export function Transitioner({ children, isLeftToRightTransition, ...props }) {
  return (
    <ScheduledTransition
      {...props}
      timeout={{
        enter: DURATION + DELAY,
        exit: DURATION,
      }}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Manager
          state={state}
          isLeftToRightTransition={isLeftToRightTransition}
        >
          <Opacity>{children}</Opacity>
        </Manager>
      )}
    </ScheduledTransition>
  );
}

Transitioner.propTypes = {
  key: PropTypes.string.required,
  children: PropTypes.node,
  isLeftToRightTransition: PropTypes.bool,
};
