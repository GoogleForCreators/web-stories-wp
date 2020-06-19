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
  createContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

export const ToasterContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState({});

  const activeToasts = useMemo(
    () => Object.values(toasts).filter((toast) => toast.isActive),
    [toasts]
  );

  const resetToasts = useCallback(() => {
    setToasts({});
  }, [setToasts]);

  const removeToast = useCallback(
    (id) => {
      const toastIdToUpdate = id || activeToasts[0].id;
      toastIdToUpdate &&
        setToasts({
          ...toasts,
          [toastIdToUpdate]: { ...toasts[toastIdToUpdate], isActive: false },
        });
    },
    [activeToasts, toasts]
  );

  const addToast = useCallback(
    ({ message, severity, id }) => {
      const isNewToast = !toasts[id];
      if (isNewToast) {
        setToasts({
          ...toasts,
          [id]: { message, severity, id, isActive: true },
        });
      }
    },
    [toasts]
  );

  useEffect(() => resetToasts, [resetToasts]);

  const value = useMemo(
    () => ({
      state: { activeToasts },
      actions: { addToast, removeToast, resetToasts },
    }),
    [addToast, activeToasts, removeToast, resetToasts]
  );

  return (
    <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node,
};

export default ToastProvider;
