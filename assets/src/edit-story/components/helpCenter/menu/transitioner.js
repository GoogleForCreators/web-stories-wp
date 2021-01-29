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
import { Transition } from 'react-transition-group';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';

const DURATION = 500;

const Manager = styled.div`
  position: relative;
  color: ${({ theme }) => theme.colors.fg.primary};
  transition: ${DURATION / 1000}s transform ${BEZIER.default},
    ${DURATION / 1000}s opacity ${BEZIER.default};
  opacity: 0.6;
  transform: scale(0.96);
  z-index: 1;

  ${({ state }) =>
    ['entered'].includes(state) &&
    css`
      opacity: 1;
      transform: none;
    `};

  ${({ state }) =>
    ['exiting', 'exited'].includes(state) &&
    css`
      position: absolute;
      bottom: 0;
    `};
`;

export function Transitioner({ children, ...props }) {
  return (
    <Transition
      {...props}
      timeout={{
        enter: 0,
        exit: DURATION,
      }}
      mountOnEnter
      unmountOnExit
    >
      {(state) => <Manager state={state}>{children}</Manager>}
    </Transition>
  );
}

Transitioner.propTypes = {
  key: PropTypes.string.required,
  children: PropTypes.node,
};
