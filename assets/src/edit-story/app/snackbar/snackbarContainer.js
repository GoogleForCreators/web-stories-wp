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
import Snackbar from './snackbar';

function getLeft(place) {
  switch (place) {
    case 'top':
    case 'bottom':
      return 'calc(50% - 10em)';
    case 'top-left':
    case 'bottom-left':
      return '60px';
    case 'top-right':
    case 'bottom-right':
      return 'calc(100vw - 20.5em)';
    default:
      return '60px';
  }
}

const Container = styled.div`
  position: fixed;
  top: ${({ place }) => (place.indexOf('top') === 0 ? 0 : 'inherit')};
  bottom: ${({ place }) => (place.indexOf('bottom') === 0 ? 0 : 'inherit')};
  left: ${({ place }) => getLeft(place)};
  z-index: 2147483647;
`;

const ChildContainer = styled.div`
  &.react-snackbar-alert__snackbar-container-enter {
    opacity: 0;
    transform: scaleY(0.1);
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
  component: Component,
  notifications,
  onRemove,
  place = 'bottom-left',
}) {
  const orderednotifications =
    place.indexOf('top') === 0 ? [...notifications].reverse() : notifications;
  return (
    <Container place={place}>
      <TransitionGroup>
        {orderednotifications.map((notification) => (
          <CSSTransition
            in
            appear={true}
            key={notification.key}
            timeout={300}
            classNames="react-snackbar-alert__snackbar-container"
          >
            <ChildContainer>
              <Component
                timeout={notification.timeout}
                onDismiss={() => onRemove(notification)}
                notification={notification}
                data={notification.data}
                place={place}
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
  notifications: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
  place: PropTypes.oneOf([
    'top',
    'bottom',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]),
};

SnackbarContainer.defaultProps = {
  component: Snackbar,
  position: 'bottom',
};

export default SnackbarContainer;
