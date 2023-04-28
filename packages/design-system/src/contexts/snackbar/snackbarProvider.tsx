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
import { useCallback, useMemo, useState } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import type { ReactNode } from 'react';

/**
 * Internal dependencies
 */
import type { SnackbarNotification } from '../../components';
import Context from './context';

interface SnackbarProviderProps {
  children: ReactNode;
  placement?: 'bottom' | 'top';
}
function SnackbarProvider({
  children,
  placement = 'bottom',
}: SnackbarProviderProps) {
  const [notifications, setNotifications] = useState<SnackbarNotification[]>(
    []
  );

  const remove = useCallback(
    (
      toRemove:
        | Pick<SnackbarNotification, 'id'>
        | Pick<SnackbarNotification, 'id'>[]
    ) => {
      setNotifications((currentNotifications) =>
        currentNotifications.filter((item) => {
          if (Array.isArray(toRemove)) {
            return !toRemove.find(({ id }) => id === item.id);
          }
          return item.id !== toRemove.id;
        })
      );
    },
    []
  );

  const create = useCallback(
    (notification: Omit<SnackbarNotification, 'id'>) => {
      const newNotification = {
        id: uuidv4(),
        ...notification,
      };
      // React may batch state updates, so use the setter that receives the
      // previous state.
      setNotifications((currentNotifications) => [
        ...currentNotifications,
        newNotification,
      ]);
    },
    []
  );

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  const state = useMemo(
    () => ({
      showSnackbar: create,
      clearSnackbar: clear,
      removeSnack: remove,
      currentSnacks: notifications,
      placement,
    }),
    [create, clear, remove, notifications, placement]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export default SnackbarProvider;
