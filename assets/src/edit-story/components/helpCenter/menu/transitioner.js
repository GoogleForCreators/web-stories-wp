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
import { TRANSITION_DURATION, Z_INDEX } from '../constants';

const DURATION = 1.2 * TRANSITION_DURATION;

const enterStyles = css`
  opacity: 1;
  transform: none;
`;
const exitStyles = css`
  position: absolute;
  bottom: 0;
  opacity: 0.6;
  transform: scale(0.96);
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
  opacity: 0.6;
  transform-origin: 50% 50%;
  transform: scale(0.96);
  transition: transform ${DURATION}ms ${BEZIER.default},
    opacity ${DURATION}ms ${BEZIER.default};
  z-index: ${Z_INDEX.MENU};

  ${({ state }) => transitionStyles[state]};
`;

export function Transitioner({ children, ...props }) {
  return (
    <ScheduledTransition
      {...props}
      timeout={DURATION}
      mountOnEnter
      unmountOnExit
    >
      {(state) => <Manager state={state}>{children}</Manager>}
    </ScheduledTransition>
  );
}

Transitioner.propTypes = {
  children: PropTypes.node,
};
