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

/**
 * ToastProvider tracks messages to display based on toastId so that if the same message occurs in a different instance it will still display
 * When a toast is dismissed early or at interval it is removed from the activeToasts but stays part of allToasts
 * When useEffect clean up is called (view change) allToasts and activeToasts will reset
 */
export const AUTO_REMOVE_TOAST_TIME_INTERVAL = 10000;

export const ToasterContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [activeToasts, setActiveToasts] = useState([]);
  const [allToasts, setAllToasts] = useState([]);

  const resetToasts = useCallback(() => {
    setAllToasts([]);
    setActiveToasts([]);
  }, [setAllToasts, setActiveToasts]);

  const removeToast = useCallback(
    (index = 0) => {
      const activeToastsCopy = JSON.parse(JSON.stringify(activeToasts));
      activeToastsCopy.splice(index, 1);
      setActiveToasts(activeToastsCopy);
    },
    [activeToasts]
  );

  const addToast = useCallback(
    ({ message, severity, errorId }) => {
      const newToast =
        allToasts.length === 0
          ? true
          : allToasts.reduce((_, toast) => {
              return toast?.errorId !== errorId;
            }, []);

      if (newToast) {
        setActiveToasts([
          ...new Set([...activeToasts, { message, severity, errorId }]),
        ]);
        setAllToasts([
          ...new Set([...allToasts, { message, severity, errorId }]),
        ]);
      }
    },
    [allToasts, activeToasts]
  );

  useEffect(() => {
    let deleteToastInterval;
    if (activeToasts.length > 0) {
      deleteToastInterval = setInterval(
        removeToast,
        AUTO_REMOVE_TOAST_TIME_INTERVAL
      );
    }

    return () => deleteToastInterval && clearInterval(deleteToastInterval);
  }, [activeToasts.length, removeToast]);

  useEffect(() => {
    return () => {
      resetToasts();
    };
  }, [resetToasts]);

  const value = useMemo(
    () => ({
      state: { activeToasts, allToasts },
      actions: { addToast, removeToast, resetToasts },
    }),
    [addToast, activeToasts, allToasts, removeToast, resetToasts]
  );

  return (
    <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node,
};

export default ToastProvider;
