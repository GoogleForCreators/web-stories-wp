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
import { BEZIER } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { ScheduledTransition } from '../transition/scheduledTransition';
import { noop } from '../../utils/noop';

const DURATION = 300;

const enterStyles = css`
  opacity: 1;
  transform: none;
`;
const exitStyles = (anchor) => css`
  opacity: 0;
  transform: translateX(${anchor === 'left' ? -20 : 20}px);
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
  ${({ zIndex }) => (zIndex ? `z-index: ${zIndex};` : '')}
  ${({ anchor }) => anchor}: 0px;
  opacity: 0;
  transform: translateX(${({ anchor }) => (anchor === 'left' ? -20 : 20)}px);
  transition: opacity ${DURATION}ms ${BEZIER.default},
    transform ${DURATION}ms ${BEZIER.default};

  ${({ state, anchor }) => {
    const fn = transitionStyles[state];
    return typeof fn === 'function' ? fn(anchor) : transitionStyles[state];
  }}
`;

function Popup({
  isOpen,
  popupId,
  children,
  ariaLabel,
  shouldKeepMounted,
  zIndex,
  anchor = 'left',
  onEnter = noop,
  onExited = noop,
}) {
  return (
    <ScheduledTransition
      in={isOpen}
      timeout={DURATION}
      mountOnEnter={!shouldKeepMounted}
      unmountOnExit={!shouldKeepMounted}
      onEnter={onEnter}
      onExited={onExited}
    >
      {(state) => (
        <Controller
          id={popupId}
          role="dialog"
          aria-label={ariaLabel}
          state={state}
          anchor={anchor}
          zIndex={zIndex}
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
  ariaLabel: PropTypes.string,
  zIndex: PropTypes.number,
  anchor: PropTypes.string,
  shouldKeepMounted: PropTypes.bool,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export default Popup;
export { default as NavigationWrapper } from './navigationWrapper';
export {
  NAVIGATION_HEIGHT,
  NAVIGATION_WIDTH,
  CARD_WIDTH,
  DISTANCE_FROM_TOP,
  DISTANCE_FROM_BOTTOM,
} from './constants';
export { TopNavigation } from './topNavigation';
export { NavBar, NavButton } from './components';
