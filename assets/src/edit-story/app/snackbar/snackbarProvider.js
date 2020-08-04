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
import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import Context from './context';
import SnackbarContainer from './snackbarContainer';

function SnackbarProvider({ children, place }) {
  const [notifications, setNotifications] = useState([]);

  const timeouts = useRef({});

  const remove = (notification) => {
    clearTimeout(timeouts.current[notification.key]);
    setNotifications((currentNotifications) => {
      return currentNotifications.filter(
        (item) => item.key !== notification.key
      );
    });

    delete timeouts.current[notification.key];
  };

  const removeNotification = (notification) => {
    const timeout = setTimeout(() => {
      remove(notification);
    }, notification.timeout);
    timeouts.current[notification.key] = timeout;
  };

  const create = (notification) => {
    const newNotification = {
      key: uuidv4(),
      timeout: notification.timeout || 5000,
      ...notification,
    };
    // React may batch state updates, so use the setter that receives the
    // previous state.
    setNotifications((currentNotifications) => [
      ...currentNotifications,
      newNotification,
    ]);
    removeNotification(newNotification);
  };

  const state = {
    showSnackbar: create,
  };

  return (
    <Context.Provider value={state}>
      <SnackbarContainer
        onRemove={remove}
        notifications={notifications}
        place={place}
      />
      {children}
    </Context.Provider>
  );
}

SnackbarProvider.propTypes = {
  place: PropTypes.string,
  children: PropTypes.node,
};

SnackbarProvider.defaultProps = {
  place: 'bottom-left',
};

export default SnackbarProvider;
