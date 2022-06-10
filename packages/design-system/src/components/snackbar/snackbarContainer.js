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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { noop, useLiveRegion } from '../../utils';
import { PLACEMENT } from '../popup';
import { SnackbarMessage } from './snackbarMessage';
import { Placement, SnackbarNotification } from './constants';

const StyledContainer = styled.div`
  position: fixed;
  top: ${({ placement }) => (placement.indexOf('top') === 0 ? 0 : 'inherit')};
  bottom: ${({ placement }) =>
    placement.indexOf('bottom') === 0 ? 0 : 'inherit'};
  ${getSnackbarXPos};
  margin-bottom: 33px;
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems};
  width: 100%;
  z-index: 2147483647;
  pointer-events: none;
`;

function getSnackbarXPos({ placement }) {
  switch (placement) {
    case 'top':
    case 'bottom':
      return `
      left: calc(50% + 4rem);
      transform: translateX(-50%);
      width: auto;
    `;
    case 'top-left':
    case 'bottom-left':
      return 'left: 60px;';
    case 'top-right':
    case 'bottom-right':
      return 'right: 60px;';
    default:
      return 'left: 60px;';
  }
}

StyledContainer.propTypes = {
  alignItems: PropTypes.string,
};
StyledContainer.defaultProps = {
  alignItems: 'center',
};

const ChildContainer = styled.div`
  &.react-snackbar-alert__snackbar-container-enter {
    max-height: 0px;
    opacity: 0;
    transition: all 300ms ease-out;
  }

  &.react-snackbar-alert__snackbar-container-enter-active {
    opacity: 1;
    max-height: 100px;
    transition: all 300ms ease-out;
  }

  &.react-snackbar-alert__snackbar-container-exit {
    opacity: 1;
    transition: all 300ms ease-out;
  }

  &.react-snackbar-alert__snackbar-container-exit-active {
    opacity: 0;
    transition: all 300ms ease-out;
  }
`;

export const SnackbarContainer = ({
  component: Component = SnackbarMessage,
  notifications = [],
  onRemove = noop,
  placement = PLACEMENT.BOTTOM,
  max = 10,
}) => {
  const speak = useLiveRegion('assertive');
  const announcedNotifications = useRef(new Set());
  const ids = useMemo(() => notifications.map(() => uuidv4()), [notifications]);

  const orderedNotifications =
    placement.indexOf('top') === 0
      ? [...notifications].reverse()
      : notifications;

  const handleDismiss = useCallback(
    (notification) => () => {
      onRemove(notification);
      notification.onDismiss?.();
    },
    [onRemove]
  );

  useEffect(() => {
    if (typeof max === 'number' && notifications.length > max) {
      setTimeout(() => {
        onRemove(notifications.slice(0, notifications.length - max));
      }, 300);
    }
  }, [max, notifications, onRemove]);

  // Announce messages to screen reader when a new message shows up
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!announcedNotifications.current.has(notification)) {
        // speak the message
        const message = `${notification.message} ${
          notification.actionHelpText || ''
        }`.trim();

        speak(message);

        announcedNotifications.current.add(notification);
      }
    });
  }, [notifications, speak]);
  const nodeRefs = useRef({});
  return (
    <StyledContainer placement={placement}>
      <TransitionGroup>
        {orderedNotifications.map((notification, index) => {
          const {
            actionLabel,
            dismissible,
            message,
            onAction,
            preventActionDismiss,
            preventAutoDismiss,
            timeout,
            ...notificationProps
          } = notification;

          const id = notification.id || ids[index];

          return (
            <CSSTransition
              in
              key={id}
              timeout={300}
              unmountOnExit
              nodeRef={nodeRefs.current[id]}
              classNames="react-snackbar-alert__snackbar-container"
            >
              <ChildContainer
                ref={(el) => {
                  nodeRefs.current[id] = el;
                }}
                placement={placement}
              >
                <Component
                  {...notificationProps}
                  aria-hidden
                  placement={placement}
                  onDismiss={handleDismiss(notification)}
                  onAction={onAction}
                  actionLabel={actionLabel}
                  message={message}
                  showCloseButton={dismissible}
                  removeMessageTimeInterval={timeout}
                  isPreventAutoDismiss={preventAutoDismiss}
                  isPreventActionDismiss={preventActionDismiss}
                />
              </ChildContainer>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </StyledContainer>
  );
};

SnackbarContainer.propTypes = {
  component: PropTypes.elementType,
  notifications: PropTypes.arrayOf(SnackbarNotification),
  onRemove: PropTypes.func,
  placement: Placement,
  max: PropTypes.number,
};
