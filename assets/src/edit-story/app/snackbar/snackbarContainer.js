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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
/**
 * Internal dependencies
 */
import { useCallback } from 'react';
import { Snackbar } from '../../../design-system';
import { SnackbarNotification } from './types';

const StyledSnackbar = styled(Snackbar.Message)`
  margin-bottom: ${({ placement }) =>
    placement.indexOf('bottom') === 0 ? '0.5em' : 0};
  margin-top: ${({ placement }) =>
    placement.indexOf('top') === 0 ? '0.5em' : 0};
`;

function getSnackbarXPos({ placement }) {
  switch (placement) {
    case 'top':
    case 'bottom':
      return 'left: calc(50% - 10em);';
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

const Container = styled.div`
  position: fixed;
  top: ${({ placement }) => (placement.indexOf('top') === 0 ? 0 : 'inherit')};
  bottom: ${({ placement }) =>
    placement.indexOf('bottom') === 0 ? 0 : 'inherit'};
  ${getSnackbarXPos}
  z-index: 2147483647;
`;

const ChildContainer = styled.div`
  &.react-snackbar-alert__snackbar-container-enter {
    opacity: 0;
    transform: scaleY(1);
  }

  &.react-snackbar-alert__snackbar-container-enter-active {
    opacity: 1;
    transform: scaleY(1);
    transition: 300ms ease-out;
    transition-property: opacity, transform;
  }

  &.react-snackbar-alert__snackbar-container-exit {
    opacity: 1;
    transform: scaleY(1);
  }

  &.react-snackbar-alert__snackbar-container-exit-active {
    opacity: 0;
    transform: scaleY(0.1);
    transition: 300ms ease-out;
    transition-property: opacity, transform;
  }
`;

function SnackbarContainer({
  component: Component = StyledSnackbar,
  notifications,
  onRemove,
  placement,
}) {
  const orderedNotifications =
    placement.indexOf('top') === 0
      ? [...notifications].reverse()
      : notifications;

  const _handleDismiss = useCallback(
    (notification) => () => {
      onRemove(notification);
      notification.onDismiss?.();
    },
    [onRemove]
  );

  return (
    <Container placement={placement}>
      <TransitionGroup>
        {orderedNotifications.map((notification) => (
          <CSSTransition
            in
            appear
            key={notification.key}
            timeout={300}
            unmountOnExit
            classNames="react-snackbar-alert__snackbar-container"
          >
            <ChildContainer>
              <Component
                aria-label={notification.message}
                placement={placement}
                handleDismiss={_handleDismiss(notification)}
                handleAction={notification.onAction}
                actionLabel={notification.actionLabel}
                message={notification.message}
                showCloseButton={Boolean(notification.dismissable)}
                removeMessageTimeInterval={notification.timeout}
                isPreventAutoDismiss={notification.preventAutoDismiss}
                isPreventActionDismiss={notification.preventActionDismiss}
              />
            </ChildContainer>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </Container>
  );
}

SnackbarContainer.propTypes = {
  component: PropTypes.elementType,
  notifications: PropTypes.arrayOf(SnackbarNotification),
  onRemove: PropTypes.func.isRequired,
  placement: PropTypes.oneOf([
    'top',
    'bottom',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]).isRequired,
};

export default SnackbarContainer;
