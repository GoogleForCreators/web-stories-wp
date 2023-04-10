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
import type { FC, ComponentProps } from 'react';
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from '@googleforcreators/react';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useLiveRegion } from '../../utils';
import SnackbarMessage from './snackbarMessage';
import { SnackbarPlacement } from './types';
import type { SnackbarNotification } from './types';

const StyledContainer = styled.div<{
  placement: SnackbarPlacement;
  alignItems?: string;
}>`
  position: fixed;
  top: ${({ placement = 'center' }) =>
    placement.indexOf('top') === 0 ? 0 : 'inherit'};
  bottom: ${({ placement = 'center' }) =>
    placement.indexOf('bottom') === 0 ? 0 : 'inherit'};
  ${getSnackbarXPos};
  margin-bottom: 33px;
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems = 'center' }) => alignItems};
  width: 100%;
  z-index: 2147483647;
  pointer-events: none;
`;

function getSnackbarXPos({ placement }: { placement: SnackbarPlacement }) {
  switch (placement) {
    case SnackbarPlacement.Top:
    case SnackbarPlacement.Bottom:
      return `
      left: calc(50% + 4rem);
      transform: translateX(-50%);
      width: auto;
    `;
    case SnackbarPlacement.TopLeft:
    case SnackbarPlacement.BottomLeft:
      return 'left: 60px;';
    case SnackbarPlacement.TopRight:
    case SnackbarPlacement.BottomRight:
      return 'right: 60px;';
    default:
      return 'left: 60px;';
  }
}

const ChildContainer = styled.div`
  &.react-snackbar-alert__snackbar-container-enter {
    max-height: 0px;
    opacity: 0;
  }

  &.react-snackbar-alert__snackbar-container-enter-active {
    opacity: 1;
    max-height: 100px;
    transition: all 300ms ease-out;
  }

  &.react-snackbar-alert__snackbar-container-exit {
    opacity: 1;
  }

  &.react-snackbar-alert__snackbar-container-exit-active {
    opacity: 0;
    transition: all 300ms ease-out;
  }
`;

interface SnackbarContainerProps {
  component?: FC<ComponentProps<typeof SnackbarMessage>>;
  notifications?: SnackbarNotification[];
  onRemove?: (
    notification: SnackbarNotification | SnackbarNotification[]
  ) => void;
  placement?: SnackbarPlacement;
  max?: number;
}

function SnackbarContainer({
  component: Component = SnackbarMessage,
  notifications = [],
  onRemove,
  placement = SnackbarPlacement.Bottom,
  max = 10,
}: SnackbarContainerProps) {
  const speak = useLiveRegion('assertive');
  const announcedNotifications = useRef(new Set());
  const ids = useMemo(() => notifications.map(() => uuidv4()), [notifications]);

  const orderedNotifications =
    placement.indexOf('top') === 0
      ? [...notifications].reverse()
      : notifications;

  const handleDismiss = useCallback(
    (notification: SnackbarNotification) => () => {
      onRemove?.(notification);
      notification.onDismiss?.();
    },
    [onRemove]
  );

  useEffect(() => {
    if (typeof max === 'number' && notifications.length > max) {
      const timeout = setTimeout(() => {
        onRemove?.(notifications.slice(0, notifications.length - max));
      }, 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [max, notifications, onRemove]);

  // Announce messages to screen reader when a new message shows up
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!announcedNotifications.current.has(notification)) {
        // speak the message
        const message = `${String(notification.message)} ${
          notification.actionHelpText || ''
        }`.trim();

        speak(message);

        announcedNotifications.current.add(notification);
      }
    });
  }, [notifications, speak]);
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
          const ref = createRef<HTMLDivElement>();

          return (
            <CSSTransition
              in
              key={id}
              timeout={300}
              unmountOnExit
              nodeRef={ref}
              classNames="react-snackbar-alert__snackbar-container"
            >
              <ChildContainer ref={ref}>
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
}

export default SnackbarContainer;
