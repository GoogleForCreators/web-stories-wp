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

export const AlertContext = createContext(null);

const Provider = ({ children }) => {
  const [activeAlerts, setActiveAlerts] = useState([
    { message: 'alert 1', severity: 'error' },
    { message: 'alert 2', severity: 'warning' },
  ]);
  const [inactiveAlerts, setInactiveAlerts] = useState([]);

  const allAlerts = useMemo(() => {
    console.log('setting all alerts ', activeAlerts, inactiveAlerts);
    return [...new Set([...activeAlerts, ...inactiveAlerts])];
    debugger;
  }, [activeAlerts, inactiveAlerts]);

  const removeAlert = useCallback(
    (index) => {
      const alertsCopy = JSON.parse(JSON.stringify(activeAlerts));
      const newInactiveAlert = alertsCopy.splice(index, 1);
      console.log('new inactive alert: ', newInactiveAlert);
      console.log('new list of active alerts ', alertsCopy);
      setActiveAlerts(alertsCopy);
      setInactiveAlerts([...new Set([...inactiveAlerts, ...newInactiveAlert])]);
      // const alertToHide = activeAlerts[index];
      // console.log(alertToHide);
      // alertToHide.isActive = false;
      // const newAlertsSet = [...new Set([...activeAlerts, alertToHide])];
      // setActiveAlerts(newAlertsSet);
    },
    [activeAlerts, inactiveAlerts]
  );

  const addAlert = useCallback(
    ({ message, severity }) => {
      const newAlert = allAlerts.reduce((_, alert) => {
        return alert?.message !== message;
      }, []);
      console.log('add this alert? ', newAlert);
      if (newAlert) {
        setActiveAlerts([...activeAlerts, { message, severity }]);
      }
    },
    [allAlerts, activeAlerts]
  );

  const value = useMemo(
    () => ({
      state: { activeAlerts },
      actions: { removeAlert, addAlert },
    }),
    [activeAlerts, removeAlert, addAlert]
  );

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node,
};

export default Provider;
