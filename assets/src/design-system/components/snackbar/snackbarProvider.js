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
import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { Placement } from './constants';
import Context from './context';
import { Snackbar } from './';

function SnackbarProvider({ children, placement = 'bottom' }) {
  const [notifications, setNotifications] = useState([]);

  const remove = useCallback((notification) => {
    setNotifications((currentNotifications) => {
      return currentNotifications.filter(
        (item) => item.key !== notification.key
      );
    });
  }, []);

  const create = useCallback((notification) => {
    const newNotification = {
      key: uuidv4(),
      ...notification,
    };
    // React may batch state updates, so use the setter that receives the
    // previous state.
    setNotifications((currentNotifications) => [
      ...currentNotifications,
      newNotification,
    ]);
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  const state = useMemo(
    () => ({
      showSnackbar: create,
      clearSnackbar: clear,
    }),
    [create, clear]
  );

  return (
    <Context.Provider value={state}>
      <Snackbar.Container
        onRemove={remove}
        notifications={notifications}
        placement={placement}
      />
      {children}
    </Context.Provider>
  );
}

SnackbarProvider.propTypes = {
  placement: Placement,
  children: PropTypes.node,
};

export default SnackbarProvider;
