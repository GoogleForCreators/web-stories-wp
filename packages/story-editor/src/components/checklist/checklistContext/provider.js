/*
 * Copyright 2021 Google LLC
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
import { useState, useMemo, useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import Context from './context';

const ChecklistProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checklistFocused, setChecklistFocused] = useState(false);
  const [openPanel, _setOpenPanel] = useState();
  const [isChecklistMounted, setIsChecklistMounted] = useState(false);

  const setOpenPanel = useCallback(
    (newOpenPanel) => {
      _setOpenPanel(newOpenPanel);
    },
    [_setOpenPanel]
  );

  const toggle = useCallback(() => {
    trackEvent('checklist_toggled', {
      status: isOpen ? 'closed' : 'open',
    });
    setIsOpen((prevVal) => !prevVal);
  }, [isOpen]);

  const close = useCallback(() => {
    trackEvent('checklist_toggled', {
      status: 'closed',
    });
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    trackEvent('checklist_toggled', {
      status: 'open',
    });
    setIsOpen(true);
    setChecklistFocused(true);
  }, []);

  const resetChecklistFocused = useCallback(
    () => setChecklistFocused(false),
    []
  );

  const contextValue = useMemo(
    () => ({
      state: {
        checklistFocused,
        isOpen,
        isChecklistMounted,
        openPanel,
      },
      actions: {
        toggle,
        close,
        open,
        resetChecklistFocused,
        setIsChecklistMounted,
        setOpenPanel,
      },
    }),
    [
      checklistFocused,
      close,
      openPanel,
      isOpen,
      open,
      resetChecklistFocused,
      toggle,
      setOpenPanel,
      setIsChecklistMounted,
      isChecklistMounted,
    ]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

ChecklistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ChecklistProvider;
