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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../animation';
import { ScheduledTransition } from '../transition/scheduledTransition';

const DURATION = 300;

const enterStyles = css`
  opacity: 1;
  transform: none;
`;
const exitStyles = css`
  opacity: 0;
  transform: translateX(-20px);
`;

const transitionStyles = {
  entering: enterStyles,
  entered: enterStyles,
  exiting: exitStyles,
  exited: exitStyles,
};

const Controller = styled.div`
  position: absolute;
  top: -12px;
  left: 0;
  opacity: 0;
  z-index: 1;
  transform: translateX(-20px);
  transition: opacity ${DURATION}ms ${BEZIER.default},
    transform ${DURATION}ms ${BEZIER.default};

  ${({ state }) => transitionStyles[state]}
`;

export function Popup({ isOpen, popupId, children }) {
  return (
    <ScheduledTransition
      in={isOpen}
      timeout={DURATION}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Controller
          id={popupId}
          role="dialog"
          state={state}
          aria-label={__('Keyboard Shortcuts Menu', 'web-stories')}
        >
          {children}
        </Controller>
      )}
    </ScheduledTransition>
  );
}
Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  popupId: PropTypes.string,
};
